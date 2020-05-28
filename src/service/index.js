const axios = require('axios');
const querystring = require('querystring');
const config = require('../config');

const zignalyAPIUrl = config.get('ZIGNALY_API_URL');
const defaultExchange = 'binance';
const typeBuy = 'buy';
const typeSell = 'sell';

// curl -d key=518cd31df66bb47e258a0551a4c565eb 
//      -d type=buy 
//      -d pair=BTCUSDT 
//      -d exchange=binance 
//      -d signalId=12345678901 
//      -d price=9160 
//      -d takeProfitAmountPercentage1=100
//      -d takeProfitPercentage1=1.25
//      -d stopLossPercentage: -5
//      -d takeProfitPrice1
//      -d stopLossPercentage
//      -d stopLoss
//      https://zignaly.com/api/signals.php

class ZignalySignal {
    constructor({signalProviderKey}) {
        this.signalProviderKey = signalProviderKey;
    }

    buySignal(data) {
        // TODO: check if takeProfitAmountPercentage1 is set then remove takeProfitPrice1
        // TODO: Same as above for StopLossPercentage
        //if(takeProfitAmountPercentage1)
        const params = {
            key: this.signalProviderKey,
            type: typeBuy, 
            pair: data.symbol, 
            exchange: defaultExchange,
            signalId: data.uuid, 
            price: data.price,
            takeProfitAmountPercentage1: data.tpVolume,
            takeProfitPrice1: data.tpPrice,
            takeProfitPercentage1: data.tpPercent,
            stopLoss: data.slPrice
        };
        this.sendSignal(params);       
    }

    sellSignal(data) {
        const params = {
            key: this.signalProviderKey,
            type: typeSell, 
            pair: data.symbol, 
            signalId: data.uuid,
            exchange: defaultExchange,
            price: data.price,
            orderType: 'limit'
        };
        this.sendSignal(params);          
    }

    sendSignal(params) {
        const querystr = querystring.stringify(params);
        console.log(`QueryString: ${querystr}`);
        axios.post(zignalyAPIUrl, querystr)
        .then(function (response) {
            console.log(`HTTP ${response.status} - ${response.statusText} - ${response.config.method}`);
        })
        .catch(function (error) {
            console.log(error);
        });         
    }
}

module.exports = ZignalySignal
