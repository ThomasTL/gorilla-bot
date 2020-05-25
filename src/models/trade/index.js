const { v4: uuidv4 } = require('uuid');
class Trade {
    constructor({pair, entryPrice, takeProfit, takeProfitVolume}) {
        this.uuid = uuidv4();
        this.pair = pair;
        this.entryPrice = entryPrice;
        this.takeProfit = takeProfit;
        this.takeProfitVolume = takeProfitVolume;
    }

    toString() {
        return `Pair: ${ this.pair }, Entry price: ${ this.entryPrice }, TP %: ${ this.takeProfit }, TP volume: ${ this.takeProfitVolume }`;
    }
}

module.exports = Trade