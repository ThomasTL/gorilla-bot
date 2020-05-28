const utils = require('../util');
const ExchangeFactory = require('../exchange');
const StrategyFactory = require('../strategy');

const kEligiblePairTimeout = 1440;

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
        this.tradingPairs = [];
        this.lastSpotPrices = [];
        const now = new Date();
        this.lastPairUpdTime = new Date(now.getTime() - (kEligiblePairTimeout * 60000));
        this.lastStgyEvalTime = this.lastPairUpdTime;         
    }

    async sendBuySignal({symbol, data}) {}
    async sendSellSignal({symbol, data}) {}
    async sendTradeSignal(trade) {}
    async processTrades() {}
    async updatePairSpotPrice(symbolPrice) {}

    async run({quoteSymbol, quoteMinVolume}) {
        const now = new Date();
        console.log(now.toString().green + '\n');

        this.exchange.getTickers({
            quoteSymbol: quoteSymbol,
            quoteMinVolume: quoteMinVolume 
        });
    } 

    // TODO: Getting the current prices for the pairs evaluated in the strategy should be done every second or less
    // Should be using a web socket instead of getting the prices from a common API.
    async onTick(tickers) {
        const now = new Date();
        let diffMs = now - this.lastPairUpdTime
        let diffMins = Math.floor(diffMs/60000);

        // BUG: Need to use something else than this.lastPairUpdTime for refreshing the eligible pairs every hour
        // TODO: Make sure that if there is an opened position with a pair that has been removed from the eligible pairs
        // It is actually remaining in the eligible pairs so that the strategy can find the proper exit point for it
        if(diffMins >= kEligiblePairTimeout) {
            this.lastPairUpdTime = now;
            this.tradingPairs = [];
            tickers.sort((a, b) =>  b.quoteVolume - a.quoteVolume );
            tickers.forEach(ticker => {
                if((ticker.symbol !== 'BTCDOWNUSDT') && (ticker.symbol !== 'BTCUPUSDT')) {
                    this.tradingPairs.push(ticker.symbol);
                }
            });
            console.log(`Eligible pairs for running the strategy: ${ this.tradingPairs.length }`);
            console.log(this.tradingPairs);
        }

        // TODO: Should update opened positions with current price 
        this.lastSpotPrices = await this.exchange.getPrices(this.tradingPairs);
        await this.processTrades();

        diffMs = now - this.lastStgyEvalTime
        diffMins = Math.floor(diffMs/60000);
        if(diffMins >= utils.getPeriodMin(this.strategy.period)) {
            console.log(new Date().toString());
            this.lastStgyEvalTime = now;
            this.tradingPairs.forEach(symbol => {
                this.strategy.evaluate({
                    symbol: symbol
                });             
            });
        }
    }       
}

module.exports = Trader