const Exchange = require('./exchange');
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

    async getCandles ({symbol, period, limit}) {
        return this.client.candles ({
            symbol: symbol,
            interval: period,
            limit: limit
        })
    }
}

module.exports = BinanceEx