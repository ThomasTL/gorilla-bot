const Strategy = require('./strategy');
//const Candlestick = require('../models/candlestick');
const tools = require('../tools');

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

    async evaluate({symbol, period}) {
        let error = false;
        // Get the candles
        //const limit = 5;
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
                console.log(`% change, candle[${ index }]: ${ tools.colorNumber(candle.percentChange() * 100) }`);
            });
            console.log(`% change, ${ this.candlesticks.length } candles: ${ tools.colorNumber(percentChangeLastThree * 100) }\n`);

            if(this.candlesticks[this.maxCandles-1].percentChange() <= 0) {
                this.sendBuySignal();
            }

            if(this.candlesticks[this.maxCandles-1].percentChange() > 0) { 
                this.sendSellSignal();
            }
        } else {
            console.log('Rebound strategy cannot be evaluated.'.red.inverse);
            error = true;
        }
         
        console.log('------------------------------------'.yellow.inverse);  

        // Compute the needed tech indicators
        // Set buy or sell signal

        return error;
    }    
}

module.exports = Rebound