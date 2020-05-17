const color = require('colors');
const StrategyRunner = require('../src/strategy-runner');

console.log('\n+---------------------------------+'.white);
console.log('|   Gorilla Signals is starting   |'.white);
console.log('+---------------------------------+\n'.white);

const pairSymbol = 'LTCBTC';
const strategy = 'Rebound';
const exchange = 'Binance';

console.log(`+------- Settings ------+`.white);
console.log('| Pair    :'.white + ` ${ pairSymbol }`.yellow);
console.log('| Strategy:'.white + ` ${ strategy }`.yellow);
console.log('| Exchange:'.white + ` ${ exchange }`.yellow);
console.log('+-----------------------+\n'.white);

strategyRunner = new StrategyRunner({
    strategyType: strategy,
    exchange: exchange
});

strategyRunner.run({
    symbol: pairSymbol
});