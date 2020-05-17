const color = require('colors');
const StrategyRunner = require('../src/strategy-runner');

console.log('\n+---------------------------------+'.white);
console.log('|   Gorilla Signals is starting   |'.white);
console.log('+---------------------------------+\n'.white);
strategyRunner = new StrategyRunner({
    strategyType: 'Rebound',
    exchange: 'Binance'
});

strategyRunner.run({
    symbol: 'LTCBTC'
});

