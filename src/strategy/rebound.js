const Strategy = require('./strategy');
const Candlestick = require('../models/candlestick');
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

    async evaluate({symbol, period}) {
        // Get the candles
        const limit = 3;
        var candles = await this.exchange.getCandles({
            symbol: symbol,
            period: period,
            limit: limit
        });

        this.candlesticks = candles.map((candle) => {
            return new Candlestick({
                symbol: symbol,
                time: new Date(candle.openTime), 
                open: parseFloat(candle.open), 
                high: parseFloat(candle.high), 
                low: parseFloat(candle.low), 
                close: parseFloat(candle.close), 
                period: period, 
                volumeQuote: parseFloat(candle.quoteAssetVolume)
            })
        })

        const percentChangeLastCandle = this.candlesticks[2].percentChange();
        var percentChangeLastThree = 0;
        this.candlesticks.forEach(candle => {
            percentChangeLastThree += candle.percentChange();
        });
        //console.log(this.candlesticks);
        console.log(`\n% change, candle[0]: ${ tools.colorNumber(this.candlesticks[0].percentChange() * 100) }`);
        console.log(`% change, candle[1]: ${ tools.colorNumber(this.candlesticks[1].percentChange() * 100) }`);
        console.log(`% change, candle[2]: ${ tools.colorNumber(this.candlesticks[2].percentChange() * 100) }`);
        console.log(`% change, 3 candles: ${ tools.colorNumber(percentChangeLastThree * 100) }\n`);

        if(this.candlesticks[2].percentChange() <= 0) {
            this.sendBuySignal();
        }

        if(this.candlesticks[2].percentChange() > 0) { 
            this.sendSellSignal();
        }
         
        console.log('------------------------------------'.yellow.inverse);  

        // Compute the needed tech indicators
        // Set buy or sell signal
    }    
}

module.exports = Rebound