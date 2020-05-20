
class Exchange {
    constructor({setTickers, setPrices}) {
        this.setTickers = setTickers;
        this.setPrices = setPrices;
    }
    async getCandleStricks ({symbol, period, limit}) {}
    async getTickers({quoteSymbol, minQuoteVolume}) {}
    async getPrices(tickers) {}
}

module.exports = Exchange