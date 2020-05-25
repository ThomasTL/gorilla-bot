const colors = require('colors');
const utils = require('../util');
const Trader = require('./trader');
const ZignalySignal = require('../service');
const Position = require('../models/position');

class ZignalyTrading extends Trader {
    constructor(data) {
        super(data);

        this.zignaly = new ZignalySignal();
        this.currentTrades = [];
        this.openedPositions = [];
        this.closedPositions = [];      
    }

    async sendBuySignal(data) { 
        let buySignalExecuted = false;
        const foundPosition = this.openedPositions.find(position => position.symbol === data.symbol);
        if(foundPosition === undefined) {
            let position = new Position(data.symbol, data.uuid);
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === data.symbol );
            position.openPosition({
                date: new Date(),
                buyPrice: data.price,
                volume: (this.minAmtToInvest / data.price)
            });
            this.openedPositions.push(position);

            this.zignaly.buySignal(data);

            buySignalExecuted = true;

            console.log(`> BUY ${ data.symbol }, price: ${ data.price }, volume: ${ (this.minAmtToInvest / data.price) }`.green);
        } else {
            // TODO: Do proper logging to show the reason why we don't want to open the position.
            //console.log(`> ${ symbol }, position already opened. Nothing to buy.`.green);
        }

        return buySignalExecuted;
    }

    async sendSellSignal({symbol, data}) {
        let sellSignalExecuted = false;
        const foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition !== undefined) {
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol);
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: symbolPrice.price
            });
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            this.zignaly.sellSignal({
                pair:symbol,
                price: data.price
            });
            sellSignalExecuted = true;
            console.log(`> SELL ${ symbol }, price: ${ symbolPrice.price }`.red);
            console.log(foundPosition.toString());
        } else {
            // TODO: Do proper logging to show the reason why we can't close the position.
            //console.log(`> ${ symbol }, no position opened. Nothing to sell.`.red); 
        }

        return sellSignalExecuted;
    }

    async sendTradeSignal(trade) {
        const buyExecuted = this.sendBuySignal({
            uuid: trade.uuid,
            symbol: trade.pair,
            price: trade.entryPrice,
            tpPercent: trade.takeProfit,
            tpVolume: trade.takeProfitVolume
        });
        if(buyExecuted){
            const foundPosition = this.openedPositions.find(position => position.symbol === trade.pair);
            trade.entryPrice = parseFloat(foundPosition.buyPrice);
            this.currentTrades.push(trade);
            console.log(trade.toString());
        }
    }    
}

module.exports = ZignalyTrading