const Strategy = require('./strategy');
const Trade = require('../models/trade');
const util = require('../util');

const percentDump = -2;
const maxCandle = 1;
const oneSat = 0.00000001;
const maxUpperLimit = 2;
const maxSymbolPrice = 0.00000080;

// TODO: Investigate the following:
// Wed May 27 2020 14:39:32 GMT+0800 (Singapore Standard Time)
// Pair: MBLBTC, Entry price: 0.00000027, TP %: undefined, TP Price: 0.00000027, TP Vol: 100%
// Wed May 27 2020 16:06:42 GMT+0800 (Singapore Standard Time)
// Pair: MBLBTC, Entry price: 0.00000027, TP %: undefined, TP Price: 0.00000025, TP Vol: 100%

class OneSat extends Strategy {
    constructor(data) {
        super(data);
        this.period = data.config.period;
        this.maxCandles = maxCandle;
    }

    async evaluate({symbol}) {
        if(util.isQuoteSymbol(symbol, 'BTC')) {
            await this.evaluateEntry({
                symbol: symbol
            });
        } else {
            console.log('This strategy is only available/applicable to BTC pairs');
        }
    }
    
    async evaluateEntry({symbol}) {
        const candlesticks = await this.exchange.getCandleSticks({
            symbol: symbol,
            period: this.period,
            limit: this.maxCandles
        });

        // TODO: Check RSI < 40 or 45 for current and previous candle
        if((candlesticks !== undefined) && (candlesticks.length === this.maxCandles)) {
            if(candlesticks[this.maxCandles-1].percentChange() <= percentDump) {
                if(candlesticks[this.maxCandles-1].open <= maxSymbolPrice) {   
                    const diffPriceOpenClose = candlesticks[this.maxCandles-1].open - candlesticks[this.maxCandles-1].close;             
                    if((diffPriceOpenClose >= oneSat) && (diffPriceOpenClose <= (oneSat * maxUpperLimit))) {
                        const tpPrice = candlesticks[this.maxCandles-1].close + oneSat;
                        const slPrice = candlesticks[this.maxCandles-1].close - (oneSat * 2);
                        const trade = new Trade({
                            pair: symbol,
                            entryPrice: candlesticks[this.maxCandles-1].close,
                            takeProfitPrice: tpPrice,
                            takeProfitVolume: 100,
                            stopLossPrice: slPrice
                        });
                        this.sendTradeSignal(trade);
                    }
                }
            }
        } else {
            console.log(`Strategy can\'t be evaluated. Pair: ${ symbol }`);
        }
    }
}

module.exports = OneSat
