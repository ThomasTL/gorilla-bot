const BinanceEx = require('./binance');
const Exchange = require('./exchange');

class Backtesting extends Exchange {
    constructor() {
        super();
        this.exchange = new BinanceEx();
        this.currentCandleStick = 0;
        this.candleSticks;
    }

    async getCandles({symbol, period}) {
        return await this.exchange.getCandleStricks({
            symbol: symbol,
            period: period,
            limit: 10
        });
    }

    async getCandleStricks ({symbol, period, limit}) {
        if(typeof this.candleSticks === 'undefined'){
            this.candleSticks = await this.getCandles({
                symbol: symbol,
                period: period
            });
            this.currentCandleStick = 0;
        }

        let candleSticks = this.candleSticks.slice(this.currentCandleStick, this.currentCandleStick + limit);
        this.currentCandleStick += limit;

        return candleSticks;
    }
}

module.exports = Backtesting