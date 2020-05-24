const colors = require('colors');
const Trader = require('./trader');

class ZignalyTrading extends Trader {
    constructor(data) {
        super(data);
    }

    async run({quoteSymbol, quoteMinVolume}) {
        const now = new Date();
        console.log(now.toString().green + '\n');

        this.exchange.getTickers({
            quoteSymbol: quoteSymbol,
            quoteMinVolume: quoteMinVolume 
        });
    }    
}

module.exports = ZignalyTrading