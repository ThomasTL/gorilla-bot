const config = require('../app-config-prod.json');

module.exports = {
    get: key => {
        return process.env[key] || config[key];
    },
}
