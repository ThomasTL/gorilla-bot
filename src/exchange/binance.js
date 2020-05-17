const Exchange = require('./exchange');
const Candlestick = require('../models/candlestick');
const config = require('../config');
const Binance = require('binance-api-node').default;

const apiKey = config.get('BINANCE_API_KEY');
const apiSecret = config.get('BINANCE_API_SECRET');

class BinanceEx extends Exchange {
    constructor() {
        super();
        this.client = Binance({
            apiKey: apiKey,
            apiSecret: apiSecret
        });
    }

    async getCandleStricks ({symbol, period, limit}) {
        const candles = await this.client.candles ({
            symbol: symbol,
            interval: period,
            limit: limit
        });

        const candleSticks = candles.map((candle) => {
            return new Candlestick({
                symbol: symbol,
                time: new Date(candle.openTime), 
                open: parseFloat(candle.open), 
                high: parseFloat(candle.high), 
                low: parseFloat(candle.low), 
                close: parseFloat(candle.close), 
                period: period, 
                volumeQuote: parseFloat(candle.quoteAssetVolume)
            });
        });

        return candleSticks;
    }
}

module.exports = BinanceEx