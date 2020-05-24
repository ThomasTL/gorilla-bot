const color = require('colors');

// TODO: Should put some order in the below tool box
module.exports = {
    colorNumber: (number) => {
        let coloredNumber = number.toFixed(2);
        if(number < 0) {
            coloredNumber = coloredNumber.red;
        } else {
            coloredNumber = coloredNumber.green;
        }
        return coloredNumber;
    },
    defaultIfNan: (variable, defaultVal) => {
        let toReturn;
        if(typeof variable === 'undefined') {
            toReturn = defaultVal;
        } else {
            toReturn = variable;
        }
        return toReturn;
    },
    getPeriodMin: (periodString) => {
        const unit = periodString.slice(-1);
        const value = parseInt(periodString.slice(0, periodString.length - 1));
        let multiplier = 1;
        if(unit.toLowerCase() === 'h') {
            multiplier = 60;
        } else if(unit.toLowerCase() === 'd') {
            multiplier = 60 * 24;
        } else if(unit.toLowerCase() === 'w') {
            multiplier = 60 * 24 * 7;
        }
        return (value * multiplier);
    },
    
    /* ,
    timeout: async (seconds) => {
        const ms = seconds * 1000;
        return new Promise(resolve => setTimeout(resolve, ms))
    } */
}