const Exchange = require('./exchange');
const Candlestick = require('../models/candlestick');
const Ticker = require('../models/ticker');
const Price = require('../models/price');
const config = require('../config');
const Binance = require('binance-api-node').default;

const apiKey = config.get('BINANCE_API_KEY');
const apiSecret = config.get('BINANCE_API_SECRET');

class BinanceEx extends Exchange {
    constructor(data) {
        super(data);
        this.client = Binance({
            apiKey: apiKey,
            apiSecret: apiSecret
        });
    }

    async getCandleSticks({symbol, period, limit}) {
        let candles, candleSticks;
        try {
            candles = await this.client.candles({
                symbol: symbol,
                interval: period,
                limit: limit
            });
            candleSticks = candles.map((candle) => {
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
        } catch(error) {
            console.log(error);
        }
        return candleSticks;
    }

    async getPrices(symbols) {
        let allLastPrices, filteredPrices;
        try {
            allLastPrices = await this.client.prices();
            filteredPrices = symbols.map(symbol => {
                return new Price({
                    symbol: symbol,
                    price: allLastPrices[symbol] 
                });
            });            
        } catch(error) {
            console.log(error);
        }
        return filteredPrices;       
    }

    async getTickers({quoteSymbol, quoteMinVolume}) {
        return this.client.ws.allTickers(tickers => {
            const filteredTickers = tickers.filter(ticker => {
                let filterIn = false;
                let pipo = 0;
                if(ticker.symbol.slice(ticker.symbol.length - quoteSymbol.length) === quoteSymbol) {
                    if(parseFloat(ticker.volumeQuote) >= quoteMinVolume) {
                        filterIn = true;
                    }
                }
                return filterIn;
            });
            const allTickers = filteredTickers.map(ticker => {
                return new Ticker({
                    symbol: ticker.symbol,
                    priceChange:ticker.priceChange, 
                    priceChangePercent: ticker.priceChangePercent, 
                    quoteVolume: ticker.volumeQuote
                })
            });            
            this.onTick(allTickers);
        });
    }
}

module.exports = BinanceEx

    // async getFilteredLastPrices(tickers) {
    //     const allLastPrices = await this.client.prices();
    //     const filteredPrices = tickers.map(ticker => {
    //         return new Price({
    //             symbol: ticker.symbol,
    //             price: allLastPrices[ticker.symbol] 
    //         });
    //     });
    //     return filteredPrices;
    // }

    // async getPrices_a(symbols) {
    //     if(symbols.length === 0) {
    //         symbols = "BTCUSDT";
    //     }
    //     this.client.ws.candles(symbols, '1m', candle => {
    //         console.log(candle);
    //         this.updateSymbolPrices(new Price({
    //             symbol: candle.symbol,
    //             price: candle.close
    //         }));
    //     });        
    // }