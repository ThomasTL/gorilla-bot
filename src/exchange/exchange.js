
class Exchange {
    constructor({onTick, updateSymbolPrices}) {
        this.onTick = onTick;
        this.updateSymbolPrices = updateSymbolPrices;
    }
    async getCandleStricks ({symbol, period, limit}) {}
    async getTickers({quoteSymbol, minQuoteVolume}) {}
    async getPrices(tickers) {}
}

module.exports = Exchange