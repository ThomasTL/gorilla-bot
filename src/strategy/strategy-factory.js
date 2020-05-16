const Rebound = require('./rebound');

const StrategyFactory = function(data, type) {
    if(type === 'Rebound'){
        return new Rebound(data);
    } 
}

module.exports = StrategyFactory