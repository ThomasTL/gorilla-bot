
class Ticker {
    constructor({symbol, priceChange, priceChangePercent, quoteVolume}) {
        this.symbol = symbol;
        this.priceChange = priceChange;
        this.priceChangePercent = priceChangePercent;
        this.quoteVolume = quoteVolume;
    }
}

module.exports = Ticker
