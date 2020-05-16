
class Candlestick {
    constructor({symbol, time, open, high, low, close, period, volumeQuote}){
      this.symbol = symbol;
      this.time = time;
      this.open = open;
      this.high = high;
      this.low = low;
      this.close = close;
      this.period = period;
      this.volumeQuote = volumeQuote;
    }

    percentChange() {
      return ((this.close - this.open) / this.open);
    } 
}

module.exports = Candlestick;

/*
;[
  {
    openTime: 1508328900000,
    open: '0.05655000',
    high: '0.05656500',
    low: '0.05613200',
    close: '0.05632400',
    volume: '68.88800000',
    closeTime: 1508329199999,
    quoteAssetVolume: '2.29500857',
    trades: 85,
    baseAssetVolume: '40.61900000',
  },
]
*/