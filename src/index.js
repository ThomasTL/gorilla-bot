const color = require('colors');
const { PaperTrading, ZignalyTrading } = require('./trader');

console.log('\n+---------------------------------+'.white);
console.log('|   Gorilla Signals is starting   |'.white);
console.log('+---------------------------------+\n'.white);

const quoteSymbol = 'BTC';
const quoteMinVolume = 75;
const exchangeType = 'Binance';
const strategy = {
    type: 'SimpleRebound',
    config: {
        period: '1m',
        maxCandles: 4
    }
}
const minAmtInvest = 0.005;

console.log(`+--------- Settings --------+`.white);
console.log('| Quote Symbol   :'.white + ` ${ quoteSymbol }`.yellow);
console.log('| Quote Min Vol. :'.white + ` ${ quoteMinVolume }`.yellow);
console.log('| Min Amt. Invest:'.white + ` ${ minAmtInvest }`.yellow);
console.log('| Strategy       :'.white + ` ${ strategy.type }`.yellow);
console.log('| Strategy Period:'.white + ` ${ strategy.config.period }`.yellow);
console.log('| Exchange       :'.white + ` ${ exchangeType }`.yellow);
console.log('+---------------------------+\n'.white);

const zignaly = new ZignalyTrading({
    strategy: strategy,
    exchangeType: exchangeType,
    minAmtToInvest: minAmtInvest
});

const paperTrading = new PaperTrading({
    strategy: strategy,
    exchangeType: exchangeType,
    minAmtToInvest: minAmtInvest
});

// paperTrading.run({
//     quoteSymbol: quoteSymbol,
//     quoteMinVolume: quoteMinVolume
// });

zignaly.run({
    quoteSymbol: quoteSymbol,
    quoteMinVolume: quoteMinVolume
});

process.on('SIGINT', function() {
    console.log('\nBye bye ...'.red);
    console.log(`Closed positions: ${ paperTrading.closedPositions.length }`);
    paperTrading.closedPositions.forEach(position => {
        console.log(position.toString());
    });
    process.exit();
});