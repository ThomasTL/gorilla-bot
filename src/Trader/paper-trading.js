const colors = require('colors');
const utils = require('../util');
const Trader = require('./trader');
const Position = require('../models/position');

const kEligiblePairTimeout = 60;

// TODO: Re-evaluate later on, the functions that should be at the parent class level
class PaperTrading extends Trader {
    constructor(data) {
        super(data);

        this.currentTrades = [];
        this.openedPositions = [];
        this.closedPositions = [];
        this.tradingPairs = [];
        this.lastSpotPrices = [];

        const now = new Date();
        this.lastTickTime = new Date(now.getTime() - (kEligiblePairTimeout * 60000));
    }

    async run({quoteSymbol, quoteMinVolume}) {
        const now = new Date();
        console.log(now.toString().green + '\n');

        this.exchange.getTickers({
            quoteSymbol: quoteSymbol,
            quoteMinVolume: quoteMinVolume 
        });
    }

    async sendBuySignal({symbol, data}) { 
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition === undefined) {
            let position = new Position(symbol);
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol );
            position.openPosition({
                date: new Date(),
                buyPrice: symbolPrice.price,
                volume: (this.minAmtToInvest / symbolPrice.price)
            });
            this.openedPositions.push(position);
            console.log(`> BUY ${ symbol }, price: ${ symbolPrice.price }, volume: ${ (amtToInvest / symbolPrice.price) }`.green);
        } else {
            // TODO: Do proper logging to show the reason why we don't want to open the position.
            //console.log(`> ${ symbol }, position already opened. Nothing to buy.`.green);
        }
    }

    async sendSellSignal({symbol, data}) {
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition !== undefined) {
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol);
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: symbolPrice.price
            });
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            console.log(`> SELL ${ symbol }, price: ${ symbolPrice.price }`.red);
            console.log(foundPosition.toString());
        } else {
            // TODO: Do proper logging to show the reason why we can't close the position.
            //console.log(`> ${ symbol }, no position opened. Nothing to sell.`.red); 
        }
    }

    async sendTradeSignal(trade) {
        this.sendBuySignal({
            symbol: trade.pair
        });
        const foundPosition = this.openedPositions.find(position => position.symbol === trade.pair);
        trade.entryPrice = parseFloat(foundPosition.buyPrice);
        this.currentTrades.push(trade);
        console.log(trade.toString());
    }

    async processTrades() {
        this.currentTrades = this.currentTrades.filter(trade => {
            let filterIn = true;
            const pairCurrentPrice = this.lastSpotPrices.find(price => price.symbol === trade.pair);
            const percentTPMultiplier = (trade.takeProfit / 100) + 1;
            if(parseFloat(pairCurrentPrice.price) >= (trade.entryPrice * percentTPMultiplier)) {
                this.sendSellSignal({
                    symbol: trade.pair
                }); 
                filterIn = false;
            }
            return filterIn;
        });
    }

    // TODO: Getting the current prices for the pairs evaluated in the strategy should be done every second or less
    // Should be using a web socket instead of getting the prices from a common API.
    async onTick(tickers) {
        const now = new Date();
        const diffMs = now - this.lastTickTime
        const diffMins = Math.floor(diffMs/60000);

        // TODO: Make sure that if there is an opened position with a pair that has been removed from the eligible pairs
        // It is actually remaining in the eligible pairs so that the strategy can find the proper exit point for it
        if(diffMins >= kEligiblePairTimeout) {
            this.lastTickTime = now;
            this.tradingPairs = [];
            tickers.sort((a, b) =>  b.quoteVolume - a.quoteVolume );
            tickers.forEach(ticker => {
                this.tradingPairs.push(ticker.symbol);
            });
            this.eligibleTickers = tickers;
            console.log(`Eligible pairs for running the strategy: ${ this.tradingPairs.length }`);
            console.log(this.tradingPairs);
        }

        // TODO: Should update opened positions with current price 
        this.lastSpotPrices = await this.exchange.getPrices(this.tradingPairs);
        await this.processTrades();

        if(diffMins >= utils.getPeriodMin(this.strategy.period)) {
            console.log(new Date().toString());
            this.lastTickTime = now;
            this.tradingPairs.forEach(symbol => {
                this.strategy.evaluate({
                    symbol: symbol
                });             
            });
            console.log(`Opened positions: ${ this.openedPositions.length }, Closed positions: ${ this.closedPositions.length }`);
        }
    }

    async updatePairSpotPrice(symbolPrice) {}
}

module.exports = PaperTrading