
class Strategy {
    constructor({sendBuySignal, sendSellSignal, runStrategy, exchange}) {
        this.sendBuySignal = sendBuySignal;
        this.sendSellSignal = sendSellSignal;
        this.runStrategy = runStrategy;
        this.exchange = exchange;
    }

    async evaluate({symbol, period}) {    
    }
}

module.exports = Strategy