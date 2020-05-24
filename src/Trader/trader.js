const ExchangeFactory = require('../exchange');
const StrategyFactory = require('../strategy');

class Trader {
    constructor(data) {
        this.exchange = new ExchangeFactory({
            onTick: async (tickers) => { this.onTick(tickers) }, 
            updatePairSpotPrice: async (prices) => { this.updatePairSpotPrice(prices) },
            type: data.exchangeType
        });
        this.strategy = new StrategyFactory({
            sendBuySignal: async ({symbol, data}) => { this.sendBuySignal({symbol, data}) },
            sendSellSignal: async ({symbol, data}) => { this.sendSellSignal({symbol, data}) },
            sendTradeSignal: async (trade) => { this.sendTradeSignal(trade) },
            exchange: this.exchange,
            config: data.strategy.config
        }, data.strategy.type);

        this.minAmtToInvest = data.minAmtToInvest;
    }

    async run({quoteSymbol, quoteMinVolume}) {}

    async sendBuySignal({symbol, data}) {}
    async sendSellSignal({symbol, data}) {}
    async sendTradeSignal(trade) {}
    async processTrades() {}

    async onTick(tickers) {}
    async updatePairSpotPrice(symbolPrice) {}
}

module.exports = Trader