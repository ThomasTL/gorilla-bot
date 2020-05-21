const Strategy = require('./strategy');
const util = require('../util');

function timeout (seconds) {
    const ms = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

class Rebound extends Strategy {
    constructor(data) {
        super(data);
        this.period = data.config.period;
        this.maxCandles = data.config.maxCandles;
    }

    async evaluate({symbol}) {
        this.candlesticks = await this.exchange.getCandleSticks({
            symbol: symbol,
            period: this.period,
            limit: this.maxCandles
        });

        if(this.candlesticks.length === this.maxCandles) {

            let percentChangeLastThree = 0;
            this.candlesticks.forEach((candle, index) => {
                percentChangeLastThree += candle.percentChange();
            });

            // Entry point is when the last candle shows a -2% dump or more
            if(this.candlesticks[this.maxCandles-1].percentChange() <= -2) {
                this.sendBuySignal(symbol);
            }
 
            // Exit point is when the last candle shows a 1% pump or more
            if(this.candlesticks[this.maxCandles-1].percentChange() > 1) { 
                this.sendSellSignal(symbol);
            }
        } else {
            // TODO: Log that something went wrong with the strategy here
        }
    }    
}

module.exports = Rebound