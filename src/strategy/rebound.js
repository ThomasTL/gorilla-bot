const Strategy = require('./strategy');
const Trade = require('../models/trade');
const util = require('../util');

const percentDump = -2;
const percentTP = 0.5;

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
        this.candlesticks = await this.exchange.getCandleSticks({
            symbol: symbol,
            period: this.period,
            limit: this.maxCandles
        });

        if((this.candlesticks !== undefined) && (this.candlesticks.length === this.maxCandles)) {

            let percentChangeLastThree = 0;
            this.candlesticks.forEach((candle, index) => {
                percentChangeLastThree += candle.percentChange();
            });

            // Entry point is when the last candle shows a -2% dump or more
            // TODO: Check for RSI <= 30 to trigger the trade
            if(this.candlesticks[this.maxCandles-1].percentChange() <= percentDump) {
                const calculatedPercentTP = Math.abs(this.candlesticks[this.maxCandles-1].percentChange() * percentTP);
                const trade = new Trade({
                    pair: symbol,
                    entryPrice: this.candlesticks[this.maxCandles-1].close,
                    takeProfit: calculatedPercentTP,
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