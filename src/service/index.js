const axios = require('axios');
const querystring = require('querystring');
const config = require('../config');

const signalProviderKey = config.get('ZIGNALY_SIGNAL_PROVIDER_KEY');
const zignalyAPIUrl = config.get('ZIGNALY_API_URL');
const defaultExchange = 'binance';
const typeBuy = 'buy';
const typeSell = 'sell';

const data = {
    key: '518cd31df66bb47e258a0551a4c565eb',
    type: 'buy', 
    pair: 'BTCUSDT', 
    exchange: 'binance',
    signalId: '12345678901', 
    price: 9160,
    takeProfitAmountPercentage1: 100,
    takeProfitPercentage1: 1.25
};

const pipoData = querystring.stringify(data);

// curl -d key=518cd31df66bb47e258a0551a4c565eb 
//      -d type=buy 
//      -d pair=BTCUSDT 
//      -d exchange=binance 
//      -d signalId=12345678901 
//      -d price=9160 
//      -d takeProfitAmountPercentage1=100
//      -d takeProfitPercentage1=1.25
//      https://zignaly.com/api/signals.php


class ZignalySignals {
    constructor() {}

    buySignal(data) {
        const params = {
            key: signalProviderKey,
            type: typeBuy, 
            pair: data.symbol, 
            exchange: defaultExchange,
            signalId: data.uuid, 
            price: data.price,
            takeProfitAmountPercentage1: data.tpVolume,
            takeProfitPercentage1: data.tpPercent
        };
        const querystr = querystring.stringify(params);
        axios.post(zignalyAPIUrl, querystr)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });        
    }
}

module.exports = ZignalySignals
