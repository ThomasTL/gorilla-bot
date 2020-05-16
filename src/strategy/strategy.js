
class Strategy {
    constructor({sendBuySignal, sendSellSignal, exchange}) {
        this.sendBuySignal = sendBuySignal;
        this.sendSellSignal = sendSellSignal;
        this.exchange = exchange;
    }

    async evaluate({symbol, period}) {    
    }
}

module.exports = Strategy