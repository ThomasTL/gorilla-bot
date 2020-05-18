
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
      return ((this.close - this.open) / this.open) * 100;
    } 
}

module.exports = Candlestick;