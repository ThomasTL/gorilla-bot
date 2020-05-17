const colors = require('colors');
const ExchangeFactory = require('../exchange');
const StrategyFactory = require('../strategy');

function timeout(seconds) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms))
}

class StrategyRunner {
    constructor({strategyType, exchange}) {
        this.exchange = new ExchangeFactory(exchange);
        this.strategy = new StrategyFactory({
            sendBuySignal: async () => { this.sendBuySignal() },
            sendSellSignal: async () => { this.sendSellSignal() },
            exchange: this.exchange,
            param: {
                period: '5m',
                maxCandles: 3
            }
        }, strategyType);

    }

    async run({symbol}) {
        this.runStrategy({
            symbol: symbol
        });

        //console.log('!!!! AFTER STRATEGY IS RUNNING !!!!'.blue.inverse);
    }

    async runStrategy({symbol}) {
        let error = false;
        const now = new Date();
        console.log(now.toString().green);

        error = await this.strategy.evaluate({
            symbol: symbol
        });

        if(error)
            return;

        await timeout(300); 

        await this.runStrategy({
            symbol: symbol
        });
    }

    sendBuySignal() { 
        console.log('!!!! BUY BUY BUY !!!!\n'.green);
    }

    sendSellSignal() {
        console.log('!!!! SELL SELL SELL !!!!\n'.red);
    }
}

module.exports = StrategyRunner