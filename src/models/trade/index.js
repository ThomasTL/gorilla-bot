
class Trade {
    constructor({pair, entryPrice, takeProfit}) {
        this.pair = pair;
        this.entryPrice = entryPrice;
        this.takeProfit = takeProfit;
    }

    toString() {
        return `Pair: ${ this.pair }, Entry price: ${ this.entryPrice }, TP %: ${ this.takeProfit }`;
    }
}

module.exports = Trade