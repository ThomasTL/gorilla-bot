const BinanceEx = require('./binance');

const ExchangeFactory = function(type) {
    if(type === 'Binance') {
        return new BinanceEx();
    }
}

module.exports = ExchangeFactory