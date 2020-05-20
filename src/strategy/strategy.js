
class Strategy {
    constructor({sendBuySignal, sendSellSignal, sendTradeSignal, exchange}) {
        this.sendBuySignal = sendBuySignal;
        this.sendSellSignal = sendSellSignal;
        this.sendTradeSignal = sendTradeSignal;
        this.exchange = exchange;
    }

    async evaluate({symbol}) {}
}

module.exports = Strategy