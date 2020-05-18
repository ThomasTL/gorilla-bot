
class Position {
    constructor(symbol) {
        this.symbol = symbol;

        this.entryDate = 'NA';
        this.buyPrice = 0;
        this.volumeBase = 0;
        this.boughtAmt = 0;
        this.currentPrice = 0;
        this.currentPnL = 0;

        this.exitDate = 'NA';
        this.sellPrice = 0;
        this.soldAmt = 0;
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

    // TODO: To review this method and make it more fail safe / robust
    toString() {
        console.log('------------------------------------------------------'.yellow.inverse);
        console.log('+ Symbol'.green);
        console.log(`+--- ${ this.symbol }`)
        console.log('+ Entry'.green);
        console.log(`+--- Date             : ${ this.entryDate }`);
        console.log(`+--- Buy price        : ${ this.buyPrice }`);
        console.log(`+--- Volume           : ${ this.volumeBase }`);
        console.log(`+--- Amount           : ${ this.boughtAmt.toFixed(2) }`);
        console.log('+ Current'.green);
        console.log(`+--- Current price    : ${ this.currentPrice.toFixed(2) }`);
        console.log(`+--- Current P&L      : ${ this.currentPnL.toFixed(2) }`);
        console.log(`+--- Current P&L (%)  : ${ this.getCurrentPercentPnL().toFixed(2) } %`);        
        console.log('+ Exit'.green);
        console.log(`+--- Date             : ${ this.exitDate }`);
        console.log(`+--- Sell price       : ${ this.sellPrice }`);
        console.log(`+--- Volume           : ${ this.volumeBase }`);
        console.log(`+--- Amount           : ${ this.soldAmt.toFixed(2) }`);
        console.log(`+--- Realised P&L     : ${ this.realisedPnL.toFixed(2) }`);
        console.log(`+--- Realised P&L (%) : ${ this.getRealisedPercentPnL().toFixed(2) } %`); 


    }
}

module.exports = Position
