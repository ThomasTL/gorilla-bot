
class Strategy {
    constructor({onBuy, onSell, exchange}) {
        this.onBuy = onBuy;
        this.onSell = onSell;
        this.exchange = exchange;
    }

    async evaluate({symbol, period}) {    
    }
}

module.exports = Strategy