const colors = require('colors');
const Exchange = require('../exchange');
const StrategyFactory = require('../strategy');

function timeout(seconds) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms))
}

class StrategyRunner {
    constructor({strategy}) {
        this.exchange = new Exchange();
        this.strategy = new StrategyFactory({
            onBuy: async () => { this.onBuy() },
            onSell: async () => { this.onSell() },
            exchange: this.exchange
        }, strategy);

    }

    async run({symbol}) {
        const now = new Date();
        console.log(now.toString().green);

        await this.strategy.evaluate({
            symbol: symbol,
            period: '5m'
        });

        await timeout(300);

        await this.run({
            symbol: symbol
        });
    }

    onBuy() { 
        console.log('**************'.green.inverse);
        console.log('BUY BUY BUY'.green);
        console.log('**************\n'.green.inverse);
    }

    onSell() {
        console.log('**************'.red.inverse);
        console.log('SELL SELL SELL'.red);
        console.log('**************\n'.red.inverse);
    }
}

module.exports = StrategyRunner