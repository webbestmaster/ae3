const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = HTTP_PORT + 1;

module.exports = {
    HTTP_PORT,
    WS_PORT
};
