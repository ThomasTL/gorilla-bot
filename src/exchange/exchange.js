
class Exchange {
    constructor({onTick, updatePairSpotPrice}) {
        this.onTick = onTick;
        this.updatePairSpotPrice = updatePairSpotPrice;
    }
    async getCandleSticks ({symbol, period, limit}) {}
    async getTickers({quoteSymbol, minQuoteVolume}) {}
    async getPrices(tickers) {}
}

module.exports = Exchange