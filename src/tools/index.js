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
    }
}