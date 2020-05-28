const colors = require('colors');
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
    }

    async sendBuySignal({symbol, data}) { 
        let buyExecuted = false;
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
            buyExecuted = true;
            console.log(`> BUY ${ symbol }, price: ${ symbolPrice.price }, volume: ${ (this.minAmtToInvest / symbolPrice.price) }`.green);
        } else {
            // TODO: Do proper logging to show the reason why we don't want to open the position.
            //console.log(`> ${ symbol }, position already opened. Nothing to buy.`.green);
        }
        return buyExecuted;
    }

    async sendSellSignal({symbol, data}) {
        let sellExecuted = false;
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition !== undefined) {
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol);
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: symbolPrice.price
            });
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            sellExecuted = true;
            console.log(`> SELL ${ symbol }, price: ${ symbolPrice.price }`.red);
            console.log(foundPosition.toString());
        } else {
            // TODO: Do proper logging to show the reason why we can't close the position.
            //console.log(`> ${ symbol }, no position opened. Nothing to sell.`.red); 
        }
        return sellExecuted;
    }

    async sendTradeSignal(trade) {
        const buyExecuted = this.sendBuySignal({
            symbol: trade.pair
        });
        if(buyExecuted){
            const foundPosition = this.openedPositions.find(position => position.symbol === trade.pair);
            trade.entryPrice = parseFloat(foundPosition.buyPrice);
            this.currentTrades.push(trade);
            console.log(trade.toString());
        }
    }

    async processTrades() {
        this.currentTrades = this.currentTrades.filter(trade => {
            let filterIn = true;
            const pairCurrentPrice = this.lastSpotPrices.find(price => price.symbol === trade.pair);
            const percentTPMultiplier = (trade.takeProfit / 100) + 1;
            if(parseFloat(pairCurrentPrice.price) >= (trade.entryPrice * percentTPMultiplier)) {
                const sellExecuted = this.sendSellSignal({
                    symbol: trade.pair
                }); 
                filterIn = !sellExecuted;
            }
            return filterIn;
        });
    }
}

module.exports = PaperTrading