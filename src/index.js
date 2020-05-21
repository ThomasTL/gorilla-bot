const color = require('colors');
const StrategyRunner = require('../src/strategy-runner');

console.log('\n+---------------------------------+'.white);
console.log('|   Gorilla Signals is starting   |'.white);
console.log('+---------------------------------+\n'.white);

const quoteSymbol = 'BTC';
const quoteMinVolume = 60
const exchangeType = 'Binance';
const strategy = {
    type: 'Rebound',
    config: {
        period: '5m',
        maxCandles: 4
    }
}

console.log(`+--------- Settings --------+`.white);
console.log('| Quote Symbol   :'.white + ` ${ quoteSymbol }`.yellow);
console.log('| Quote Min Vol. :'.white + ` ${ quoteMinVolume }`.yellow);
console.log('| Strategy       :'.white + ` ${ strategy.type }`.yellow);
console.log('| Exchange       :'.white + ` ${ exchangeType }`.yellow);
console.log('+---------------------------+\n'.white);

strategyRunner = new StrategyRunner({
    strategy: strategy,
    exchangeType: exchangeType
});

strategyRunner.run({
    quoteSymbol: quoteSymbol,
    quoteMinVolume: quoteMinVolume
});