const colors = require('colors');
const ExchangeFactory = require('../exchange');
const StrategyFactory = require('../strategy');
const Position = require('../models/position');

function timeout(seconds) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms))
}

class StrategyRunner {
    constructor({strategyType, exchange}) {
        this.exchange = new ExchangeFactory(exchange);
        this.strategy = new StrategyFactory({
            sendBuySignal: async (symbol) => { this.sendBuySignal(symbol) },
            sendSellSignal: async (symbol) => { this.sendSellSignal(symbol) },
            exchange: this.exchange,
            param: {
                period: '5m',
                maxCandles: 4
            }
        }, strategyType);
        this.openedPositions = [];
        this.closedPositions = [];
    }

    async run({symbol}) {
        const now = new Date();
        console.log(now.toString().green + '\n');
        this.strategy.evaluate({ symbol: symbol });
    }

    async sendBuySignal(symbol) { 
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(typeof foundPosition === 'undefined') {
            let position = new Position(symbol);
            position.openPosition({
                date: new Date(),
                buyPrice: 9400, // TODO
                volume: 0.0015 // TODO
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
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: 9800 // TODO
            });
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            console.log(`> SELL ${ symbol }`.red);
            foundPosition.toString();
        } else {
            console.log(`> ${ symbol }, no position opened. Nothing to sell.`.red); 
        }
    }
}

module.exports = StrategyRunner