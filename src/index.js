const color = require('colors');
const { PaperTrading, ZignalyTrading } = require('./trader');

console.log('\n+---------------------------------------------------------------+'.white.inverse);
console.log('|                  Gorilla Signals is starting                  |'.white.inverse);
console.log('+---------------------------------------------------------------+\n'.white.inverse);

const quoteSymbol = 'USDT';
const quoteMinVolume = 700000;
const exchangeType = 'Binance';
const strategy = {
    type: 'SimpleRebound',
    config: {
        period: '1m',
        maxCandles: 4
    }
}
const minAmtInvest = 40;
const traderType = "zignaly";

console.log(`+------------ Settings -----------+`.white);
console.log('| Trade Type     :'.white + ` ${ traderType }`.yellow);
console.log('| Quote Symbol   :'.white + ` ${ quoteSymbol }`.yellow);
console.log('| Quote Min Vol. :'.white + ` ${ quoteMinVolume }`.yellow);
console.log('| Min Amt. Invest:'.white + ` ${ minAmtInvest }`.yellow);
console.log('| Strategy       :'.white + ` ${ strategy.type }`.yellow);
console.log('| Strategy Period:'.white + ` ${ strategy.config.period }`.yellow);
console.log('| Exchange       :'.white + ` ${ exchangeType }`.yellow);
console.log('+---------------------------------+\n'.white);

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

let trader;
if(traderType === "paper") {
    trader = paperTrading;
    paperTrading.run({
        quoteSymbol: quoteSymbol,
        quoteMinVolume: quoteMinVolume
    });
} else if(traderType === "zignaly") {
    trader = zignaly;
    zignaly.run({
        quoteSymbol: quoteSymbol,
        quoteMinVolume: quoteMinVolume
    });
}

process.on('SIGINT', function() {
    console.log('\nBye bye ...'.red);
    if(trader !== undefined) {
        console.log(`Opened positions: ${ trader.openedPositions.length }`);
        trader.openedPositions.forEach(position => {
            console.log(position.toString());
        });   
        console.log(`Closed positions: ${ trader.closedPositions.length }`);
        trader.closedPositions.forEach(position => {
            console.log(position.toString());
        });  
    }
    console.log('\n+---------------------------------------------------------------+'.white.inverse);
    console.log('|                  Gorilla Signals is stoping                   |'.white.inverse);
    console.log('+---------------------------------------------------------------+\n'.white.inverse);    
    process.exit();
});