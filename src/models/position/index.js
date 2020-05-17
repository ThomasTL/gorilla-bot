
class Position {
    constructor(symbol) {
        this.symbol = symbol;
    }

    openPosition({date, buyPrice, volume}) {
        this.entryDate = date;
        this.buyPrice = buyPrice;
        this.volumeBase = volume;
        this.boughtAmt = buyPrice * volume;
        this.currentPrice = buyPrice;
        this.currentPnL = 0;
    }

    closePosition({date, sellPrice}) {
        this.exitDate = date;
        this.sellPrice = sellPrice;
        this.soldAmt = this.volumeBase * sellPrice;
        this.soldPnL = this.soldAmt - this.boughtAmt;
    }

    setCurrentPrice(price) {
        this.currentPrice = price;
        this.currentPnL =  (this.volumeBase * price) - this.boughtAmt;
    }

    getSoldPercentPnL() {
        return (this.soldPnL / this.boughtAmt) * 100;
    }

    getCurrentPercentPnL() {
        return (this.currentPnL / this.boughtAmt) * 100;
    }

    toString() {
        console.log('------------------------------------------------------'.yellow.inverse);
        console.log('Symbol'.green);
        console.log(`+-- ${ this.symbol }`)
        console.log('Entry'.green);
        console.log(`+-- Date         :`.white + ` ${ this.entryDate }`.yellow);
        console.log(`+-- Buy price    : ${ this.buyPrice }`);
        console.log(`+-- Volume       : ${ this.volumeBase }`);
        console.log(`+-- Amount       : ${ this.boughtAmt.toFixed(2) }`);
        console.log('Exit'.green);
        console.log(`+-- Date         : ${ this.exitDate }`);
        console.log(`+-- Sell price   : ${ this.sellPrice }`);
        console.log(`+-- Volume       : ${ this.volumeBase }`);
        console.log(`+-- Amount       : ${ this.soldAmt.toFixed(2) }`);
        console.log('P&L'.green);
        console.log(`+-- Current      : ${ this.currentPnL.toFixed(2) }`);
        console.log(`+-- Current (%)  : ${ this.getCurrentPercentPnL().toFixed(2) } %`);
        console.log(`+-- Realised     : ${ this.soldPnL.toFixed(2) }`);
        console.log(`+-- Realised (%) : ${ this.getSoldPercentPnL().toFixed(2) } %`);
    }
}

module.exports = Position

/*
    Example:
    BTCUSDT
    Open Position: 16/05, Buy price: 9400 USDT, volume: 0.0015 BTC
        => boughtAmt = 9400 * 0.0015 = 14.1 USDT
    Close Position: 17/05, Sell Price = 9800 USDT
        => soldAmt = 9800 * 0.0015 = 14.7 USDT
        => soldPnl = 14.7 - 14.1 = 0.6 USDT
        => soldPnLPercent = (0.6 / 14.1) * 100 = ((9800-9400) / 9400) * 100 = 4.25%
*/
