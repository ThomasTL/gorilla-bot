const Strategy = require('./strategy');
const tools = require('../tools');

function timeout(seconds) {
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
        this.period = data.param.period;
        this.maxCandles = data.param.maxCandles;
    }

    async evaluate({symbol}) {
        let error = false;
        this.candlesticks = await this.exchange.getCandleStricks({
            symbol: symbol,
            period: this.period,
            limit: this.maxCandles
        });

        if(this.candlesticks.length === this.maxCandles) {
            console.log(symbol.magenta);

            let percentChangeLastThree = 0;
            this.candlesticks.forEach((candle, index) => {
                percentChangeLastThree += candle.percentChange();
                console.log(`% change, candle[${ index }]: ${ tools.colorNumber(candle.percentChange()) }`);
            });
            console.log(`% change, ${ this.candlesticks.length } candles: ${ tools.colorNumber(percentChangeLastThree) }`);

            if(this.candlesticks[this.maxCandles-1].percentChange() <= 0) {
                this.sendBuySignal(symbol);
            }

            if(this.candlesticks[this.maxCandles-1].percentChange() > 0) { 
                this.sendSellSignal(symbol);
            }

            console.log('\n------------------------------------'.yellow.inverse);
            await timeout(300);
            await this.evaluate({symbol: symbol});
        } else {
            console.log('Rebound strategy cannot be evaluated. No more data!'.red.inverse);
            error = true;
        }

        return error;
    }    
}

module.exports = Rebound