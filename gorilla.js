const color = require('colors');
const { PaperTrading, ZignalyTrading } = require('./src/trader');
const figlet = require('figlet');

// Other nice fonts: 'DOS Rebel','Ticks Slant'
console.log('\n' + figlet.textSync('Gorilla Bot', {
    font: 'Big Money-ne',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

//const signalProviderKey = "YOUR_ZIGNALY_SIGNAL_PROVIDER_KEY_HERE";

const quoteSymbol = 'BTC';
const quoteMinVolume = 200;
const exchangeType = 'Binance';
const strategy = {
    type: 'SimpleRebound',
    config: {
        period: '1m',
        maxCandles: 4,
        percentDump: -0.1,
        tpRatio: 0.75
    }
}
const minAmtInvest = 0.005;
const traderType = "paper";

console.log(`+------------ Settings -----------+`.white);
console.log('| Trade Type     :'.white + ` ${ traderType }`.yellow);
console.log('| Provider key   :'.white + ` ${ signalProviderKey }`.yellow);
console.log('| Quote Symbol   :'.white + ` ${ quoteSymbol }`.yellow);
console.log('| Quote Min Vol. :'.white + ` ${ quoteMinVolume }`.yellow);
console.log('| Min Amt. Invest:'.white + ` ${ minAmtInvest }`.yellow);
console.log('| Exchange       :'.white + ` ${ exchangeType }`.yellow);
console.log('+---------------------------------+\n'.white);

console.log(strategy);

const zignaly = new ZignalyTrading({
    strategy: strategy,
    exchangeType: exchangeType,
    minAmtToInvest: minAmtInvest,
    signalProviderKey: signalProviderKey
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
        console.log(`\nOpened positions: ${ trader.openedPositions.length }`);
        trader.openedPositions.forEach(position => {
            console.log(position.toString());
        });   
        console.log(`\nClosed positions: ${ trader.closedPositions.length }`);
        trader.closedPositions.forEach(position => {
            console.log(position.toString());
        });  
    }
    console.log('\n+---------------------------------------------------------------+'.white.inverse);
    console.log('|                  Gorilla Signals is stoping                   |'.white.inverse);
    console.log('+---------------------------------------------------------------+\n'.white.inverse);    
    process.exit();
});