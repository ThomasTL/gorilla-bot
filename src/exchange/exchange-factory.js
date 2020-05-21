const BinanceEx = require('./binance');
const Backtesting = require('./backtesting');

const ExchangeFactory = function(data) {
    if(data.type === 'Binance') {
        return new BinanceEx({
            onTick: data.onTick, 
            updateSymbolPrices: data.updateSymbolPrices
        });
    } else if(data.type === 'Backtesting') {
        return new Backtesting();
    }
}

module.exports = ExchangeFactory