const color = require('colors');

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
    }/* ,
    timeout: async (seconds) => {
        const ms = seconds * 1000;
        return new Promise(resolve => setTimeout(resolve, ms))
    } */
}