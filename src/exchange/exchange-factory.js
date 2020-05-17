const BinanceEx = require('./binance');
const Backtesting = require('./backtesting');

const ExchangeFactory = function(type) {
    if(type === 'Binance') {
        return new BinanceEx();
    } else if(type === 'Backtesting') {
        return new Backtesting();
    }
}

module.exports = ExchangeFactory