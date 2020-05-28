const colors = require('colors');
const Trader = require('./trader');
const ZignalySignal = require('../service');
const Position = require('../models/position');

class ZignalyTrading extends Trader {
    constructor(data) {
        super(data);

        this.zignaly = new ZignalySignal({
            signalProviderKey: data.signalProviderKey
        });
        this.currentTrades = [];
        this.openedPositions = [];
        this.closedPositions = [];      
    }

    async sendBuySignal(data) { 
        let buySignalExecuted = false;
        const position = this.openPosition(data.symbol, data.price, data.uuid);
        if(position !== undefined) {
            this.zignaly.buySignal(data);
            buySignalExecuted = true;
        } else {
            // TODO: Do proper logging to show the reason why we don't want to open the position.
            //console.log(`> ${ symbol }, position already opened. Nothing to buy.`.green);
        }
        return buySignalExecuted;
    }

    async sendSellSignal(data) {
        let sellSignalExecuted = false;
        const position = this.closePosition(data.symbol);
        if(position !== undefined) {
            this.zignaly.sellSignal(data);
            sellSignalExecuted = true;
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
            tpPercent: trade.takeProfitPercent,
            tpPrice: trade.takeProfitPrice,
            tpVolume: trade.takeProfitVolume,
            slPrice: trade.stopLossPrice
        });
        if(buyExecuted){
            const foundPosition = this.openedPositions.find(position => position.symbol === trade.pair);
            trade.entryPrice = parseFloat(foundPosition.buyPrice);
            this.currentTrades.push(trade);
            console.log(trade.toString());
        }
    }  
    
    // TODO: Add on SL because if there is a SL triggered and it is not 
    async processTrades() {
        this.currentTrades = this.currentTrades.filter(trade => {
            let filterIn = true;
            const pairCurrentPrice = this.lastSpotPrices.find(price => price.symbol === trade.pair);
            const percentTPMultiplier = (trade.takeProfit / 100) + 1;
            if((parseFloat(pairCurrentPrice.price) >= (trade.entryPrice * percentTPMultiplier)) 
            || (parseFloat(pairCurrentPrice.price) >= trade.takeProfitPrice)) {
                this.closePosition(trade.pair);    
                filterIn = false;
            }
            return filterIn;
        });
    } 
    
    openPosition(symbol, price, uuid) {
        let foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition === undefined) {
            foundPosition = new Position(symbol, uuid);
            //const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol );
            foundPosition.openPosition({
                date: new Date(),
                buyPrice: price,
                volume: (this.minAmtToInvest / price)
            });
            this.openedPositions.push(foundPosition);
            console.log(`> BUY ${ symbol }, price: ${ price.toFixed(8) }, volume: ${ (this.minAmtToInvest / price).toFixed(0) }`.green);
        } else {
            foundPosition = undefined;
        }
        return foundPosition;
    }

    closePosition(symbol) {
        let foundPosition = this.openedPositions.find(position => position.symbol === symbol);
        if(foundPosition !== undefined) {
            const symbolPrice = this.lastSpotPrices.find(price => price.symbol === symbol);
            foundPosition.closePosition({
                date: new Date(),
                sellPrice: parseFloat(symbolPrice.price)
            });         
            this.closedPositions.push(foundPosition);
            this.openedPositions = this.openedPositions.filter(position => position.symbol !== foundPosition.symbol);
            console.log(`> SELL ${ symbol }, price: ${ symbolPrice.price }`.red);
            console.log(foundPosition.toString());
        }
        return foundPosition;
    }
}

module.exports = ZignalyTrading