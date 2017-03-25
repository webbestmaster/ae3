const FsServer = require('fs-server');
const ws = require('websocket.io');

const mainConst = require('./../_main/const.json');

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = HTTP_PORT + 1;

const requestBodyParser = require('./lib/internal/request-body-parser');

const fsServerConfig = {
    root: './../_front/dist/', // path to front-end part of site
    port: HTTP_PORT // optional, recommended this, or do not use this field
    // page404: 'custom-404-page/index.html' // optional, path to custom 404 page
};

const fsServer = new FsServer(fsServerConfig) // create server with config
    .run(); // create server with config and run

// get info about server
fsServer.bindRequest('get', mainConst.LINK.GET_SERVER_INFO, function (req, res) {
    res.end(JSON.stringify({
        HTTP_PORT,
        WS_PORT
    }));
});

// initialize game
fsServer.bindRequest('post', mainConst.LINK.INITIALIZE_OFFER_GAME, function (req, res) {

    requestBodyParser(req, body => {

        console.log(body);

        res.end(body);

    });

});

/*
 server.bindRequest('get', 'api/:class/:method', function (req, res, url, className, methodName) {
 res.end([className, methodName].join('+'));
 }, server);
 */

const weServer = ws.listen(WS_PORT);

weServer.on('connection', function (socket) {
    socket.on('message', function () {
    });
    socket.on('close', function () {
    });
});
