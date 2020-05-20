const colors = require('colors');
const ExchangeFactory = require('../exchange');
const StrategyFactory = require('../strategy');
const Position = require('../models/position');

class StrategyRunner {
    constructor({strategy, exchangeType}) {
        this.exchange = new ExchangeFactory({
            setTickers: async (tickers) => { this.setTickers(tickers) }, 
            setPrices: async (prices) => { this.setPrices(prices) },
            type: exchangeType
        });
        this.strategy = new StrategyFactory({
            sendBuySignal: async (symbol) => { this.sendBuySignal(symbol) },
            sendSellSignal: async (symbol) => { this.sendSellSignal(symbol) },
            sendTradeSignal: async (symbol) => { this.sendTradeSignal(symbol) },
            exchange: this.exchange,
            config: strategy.config
        }, strategy.type);
        this.openedPositions = [];
        this.closedPositions = [];
        this.eligibleSymbols = [];
        this.eligiblePrices = [];
    }

    async run({quoteSymbol, quoteMinVolume}) {
        const now = new Date();
        console.log(now.toString().green + '\n');

        this.exchange.getTickers({
            quoteSymbol: quoteSymbol,
            quoteMinVolume: quoteMinVolume 
        });

        //while(this.eligibleSymbols.length === 0){}

        this.exchange.getPrices(this.eligibleSymbols);

/*        
        this.eligibleSymbols.forEach(symbol => {
            this.strategy.evaluate({
                symbol: symbol
            });
        });
*/
    }

    async sendBuySignal(symbol) { 
        // TODO: Need to remove this constant and set this as strategy config
        const amtToInvest = 40;

        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(typeof foundPosition === 'undefined') {
            let position = new Position(symbol);
            const symbolPrice = this.eligiblePrices.find(price => { price.symbol === symbol});
            position.openPosition({
                date: new Date(),
                buyPrice: symbolPrice.price,
                volume: (amtToInvest / symbolPrice.price)
            });
            this.openedPositions.push(position);
            console.log(`> BUY ${ symbol }`.green);
            position.toString();
        } else {
            console.log(`> ${ symbol }, position already opened. Nothing to buy.`.green);
        }
    }

    async sendSellSignal(symbol) {
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(typeof foundPosition !== 'undefined') {
            const symbolPrice = this.eligiblePrices.find(price => { price.symbol === symbol});
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: symbolPrice.price
            });
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            console.log(`> SELL ${ symbol }`.red);
            foundPosition.toString();
        } else {
            console.log(`> ${ symbol }, no position opened. Nothing to sell.`.red); 
        }
    }

    async sendTradeSignal(symbol) {
        
    }

    async setTickers(tickers) {
        this.eligibleTickers = tickers;
        tickers.forEach(ticker => {
            this.eligibleSymbols.push(ticker.symbol);
        });
    }

    async setPrices(symbolPrice) {
        this.eligiblePrices = symbolPrice;
    }
}

module.exports = StrategyRunner