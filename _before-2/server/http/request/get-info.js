const serverConst = require('./../../server-const.js');
const {httpPort} = serverConst;

const serverInfoResponse = JSON.stringify({
    httpPort
});

module.exports.getInfo = (req, res) => res.end(serverInfoResponse);
