const util = require('../../util');

class Position {
    constructor(symbol) {
        this.symbol = symbol;

        this.currentPnL = 0;
        this.realisedPnL = 0;
    }

    openPosition({date, buyPrice, volume}) {
        this.entryDate = date;
        this.buyPrice = buyPrice;
        this.volumeBase = volume;
        this.boughtAmt = buyPrice * volume;
        this.currentPrice = buyPrice;
    }

    closePosition({date, sellPrice}) {
        this.exitDate = date;
        this.sellPrice = sellPrice;
        this.soldAmt = this.volumeBase * sellPrice;
        this.realisedPnL = this.soldAmt - this.boughtAmt;
    }

    setCurrentPrice(price) {
        this.currentPrice = price;
        this.currentPnL =  (this.volumeBase * price) - this.boughtAmt;
    }

    getRealisedPercentPnL() {
        return (this.realisedPnL / this.boughtAmt) * 100;
    }

    getCurrentPercentPnL() {
        return (this.currentPnL / this.boughtAmt) * 100;
    }

    /*
    log() {
        let entryDate = util.defaultIfNan(this.entryDate, 'NA');
        let buyPrice = util.defaultIfNan(this.buyPrice, 0);
        let volumeBase = util.defaultIfNan(this.volumeBase, 0);
        let boughtAmt = util.defaultIfNan(this.boughtAmt, 0);
        let currentPrice = util.defaultIfNan(this.currentPrice, 0);
        let currentPnL = util.defaultIfNan(this.currentPnL, 0);
        let exitDate = util.defaultIfNan(this.exitDate, 'NA');
        let sellPrice = util.defaultIfNan(this.sellPrice, 0);
        let soldAmt = util.defaultIfNan(this.soldAmt, 0);
        let realisedPnL = util.defaultIfNan(this.realisedPnL, 0);

        console.log('------------------------------------------------------'.yellow.inverse);
        console.log('+ Symbol'.green);
        console.log(`+--- ${ this.symbol }`)
        console.log('+ Entry'.green);
        console.log(`+--- Date             : ${ entryDate }`);
        console.log(`+--- Buy price        : ${ buyPrice }`);
        console.log(`+--- Volume           : ${ volumeBase }`);
        console.log(`+--- Amount           : ${ boughtAmt.toFixed(8) }`);
        console.log('+ Current'.green);
        console.log(`+--- Current price    : ${ currentPrice }`);
        console.log(`+--- Current P&L      : ${ currentPnL.toFixed(8) }`);
        console.log(`+--- Current P&L (%)  : ${ this.getCurrentPercentPnL().toFixed(2) } %`);        
        console.log('+ Exit'.green);
        console.log(`+--- Date             : ${ exitDate }`);
        console.log(`+--- Sell price       : ${ sellPrice }`);
        console.log(`+--- Volume           : ${ volumeBase }`);
        console.log(`+--- Amount           : ${ soldAmt.toFixed(8) }`);
        console.log(`+--- Realised P&L     : ${ realisedPnL.toFixed(8) }`);
        console.log(`+--- Realised P&L (%) : ${ this.getRealisedPercentPnL().toFixed(2) } %`); 
    }
*/
    toString() {
        let entryDate = util.defaultIfNan(this.entryDate, 'NA');
        let buyPrice = util.defaultIfNan(this.buyPrice, 0);
        let volumeBase = util.defaultIfNan(this.volumeBase, 0);
        let boughtAmt = util.defaultIfNan(this.boughtAmt, 0);
        let currentPrice = util.defaultIfNan(this.currentPrice, 0);
        let currentPnL = util.defaultIfNan(this.currentPnL, 0);
        let exitDate = util.defaultIfNan(this.exitDate, 'NA');
        let sellPrice = util.defaultIfNan(this.sellPrice, 0);
        let soldAmt = util.defaultIfNan(this.soldAmt, 0);
        let realisedPnL = util.defaultIfNan(this.realisedPnL, 0);

        let string = '\n------------------------------------------------------';
        string += '\n+ Symbol';
        string += `\n+--- ${ this.symbol }`;
        string += '\n+ Entry';
        string += `\n+--- Date             : ${ entryDate }`;
        string += `\n+--- Buy price        : ${ buyPrice }`;
        string += `\n+--- Volume           : ${ volumeBase }`;
        string += `\n+--- Amount           : ${ boughtAmt.toFixed(8) }`;
        string += '\n+ Current';
        string += `\n+--- Current price    : ${ currentPrice }`;
        string += `\n+--- Current P&L      : ${ currentPnL.toFixed(8) }`;
        string += `\n+--- Current P&L (%)  : ${ this.getCurrentPercentPnL().toFixed(2) } %`;  
        string += '\n+ Exit';
        string += `\n+--- Date             : ${ exitDate }`;
        string += `\n+--- Sell price       : ${ sellPrice }`;
        string += `\n+--- Volume           : ${ volumeBase }`;
        string += `\n+--- Amount           : ${ soldAmt.toFixed(8) }`;
        string += `\n+--- Realised P&L     : ${ realisedPnL.toFixed(8) }`;
        string += `\n+--- Realised P&L (%) : ${ this.getRealisedPercentPnL().toFixed(2) } %`; 

        return string;
    }
}

module.exports = Position
