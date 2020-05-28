const Strategy = require('./strategy');
const Trade = require('../models/trade');
const util = require('../util');

const percentDump = -2;
const percentTP = 0.75;

class SimpleRebound extends Strategy {
    constructor(data) {
        super(data);
        this.period = data.config.period;
        this.maxCandles = data.config.maxCandles;
    }

    async evaluate({symbol}) {
        await this.evaluateEntry({
            symbol: symbol
        });
    }
    
    async evaluateEntry({symbol}) {
        const candlesticks = await this.exchange.getCandleSticks({
            symbol: symbol,
            period: this.period,
            limit: this.maxCandles
        });

        if((candlesticks !== undefined) && (candlesticks.length === this.maxCandles)) {

            let percentChangeLastThree = 0;
            candlesticks.forEach((candle, index) => {
                percentChangeLastThree += candle.percentChange();
            });

            // Entry point is when the last candle shows a -2% dump or more
            // TODO: Check for RSI <= 30 to trigger the trade
            if(candlesticks[this.maxCandles-1].percentChange() <= percentDump) {
                let calculatedPercentTP = Math.abs(candlesticks[this.maxCandles-1].percentChange() * percentTP);
                // TODO: Below test only works for BTC. Need to generalise to any coin
                if(((candlesticks[this.maxCandles-1].close * calculatedPercentTP) / 100) < 0.00000001) {
                    calculatedPercentTP = (0.00000001 / candlesticks[this.maxCandles-1].close) * 100;
                }
                const tpPrice = candlesticks[this.maxCandles-1].close * ((calculatedPercentTP / 100) + 1);
                const trade = new Trade({
                    pair: symbol,
                    entryPrice: candlesticks[this.maxCandles-1].close,
                    takeProfitPercent: calculatedPercentTP,
                    //takeProfitPrice: tpPrice,
                    takeProfitVolume: 100
                });
                this.sendTradeSignal(trade);
            }
        } else {
            // TODO: Log that something went wrong with the strategy here
            console.log(`Strategy can\'t be evaluated. Pair: ${ symbol }`);
        }
    }

    async evaluateExit({symbol}) {}
}

module.exports = SimpleRebound

/*
    Strategy needs to be given:
    - Candles or ticker
    Strategy will calculates
    - Technical indicators
    It:
    - Sends a buy event to a position when it is time to buy 
    - Sends a sell event to a position when it is time to sell
    The above given the technical indicators
*/