
class Strategy {
    constructor({sendBuySignal, sendSellSignal, sendTradeSignal, exchange, config}) {
        this.sendBuySignal = sendBuySignal;
        this.sendSellSignal = sendSellSignal;
        this.sendTradeSignal = sendTradeSignal;
        this.exchange = exchange;
        this.period = config.period;
    }

    async evaluate({symbol}) {}
    async evaluateEntry({symbol}) {}
    async evaluateExit({symbol}) {}
    async evaluateTrade({symbol}) {}
}

module.exports = Strategy