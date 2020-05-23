const SimpleRebound = require('./rebound');

const StrategyFactory = function(data, type) {
    if(type === 'SimpleRebound'){
        return new SimpleRebound(data);
    } 
}

module.exports = StrategyFactory