const colors = require('colors');
const Trader = require('./trader');

class ZignalyTrading extends Trader {
    constructor(data) {
        super(data);
    }
}

module.exports = ZignalyTrading