const color = require('colors');
const StrategyRunner = require('../src/strategy-runner');

strategyRunner = new StrategyRunner({
    strategy: 'Rebound',
    exchange: 'Binance'
});

strategyRunner.run({
    symbol: 'RCNBTC'
});

