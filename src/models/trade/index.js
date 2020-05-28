const { v4: uuidv4 } = require('uuid');
class Trade {
    constructor({pair, entryPrice, takeProfitPercent, takeProfitPrice, takeProfitVolume, stopLossPercent, stopLossPrice}) {
        this.uuid = uuidv4();
        this.pair = pair;
        this.entryPrice = entryPrice;
        this.takeProfitPercent = takeProfitPercent;
        this.takeProfitPrice = takeProfitPrice;
        this.takeProfitVolume = takeProfitVolume;
        this.stopLossPercent = stopLossPercent;
        this.stopLossPrice = stopLossPrice;
    }

    toString() {
        return `Pair: ${ this.pair }, Entry price: ${ this.entryPrice.toFixed(8) }, TP %: ${ this.takeProfit }, TP Price: ${ this.takeProfitPrice.toFixed(8) }, TP Vol: ${ this.takeProfitVolume }%`;
    }
}

module.exports = Trade