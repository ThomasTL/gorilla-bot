const SimpleRebound = require('./rebound');
const OneSat = require('./onesat');

const StrategyFactory = function(data, type) {
    if(type === 'SimpleRebound'){
        return new SimpleRebound(data);
    } else if(type === 'OneSat'){
        return new OneSat(data);
    }
}

module.exports = StrategyFactory