const color = require('colors');
//const price = require('../prices');
const StrategyRunner = require('../strategy-runner');

module.exports = {
    start: async () => {
        console.log("Gorilla starts finding trades to start ...\n".white.inverse);
        //await price.getTickersWs();
        //await price.getCandles();
        
        strategyRunner = new StrategyRunner({
            strategy: 'Rebound'
        });
        strategyRunner.run({
            symbol: 'RCNBTC'
        });
    }
}