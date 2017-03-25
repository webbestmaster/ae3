const FsServer = require('fs-server');
const ws = require('websocket.io');

const serverConst = require('./const');

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = HTTP_PORT + 1;

const fsServerConfig = {
    root: './../_front/dist/', // path to front-end part of site
    port: HTTP_PORT // optional, recommended this, or do not use this field
    // page404: 'custom-404-page/index.html' // optional, path to custom 404 page
};

const fsServer = new FsServer(fsServerConfig) // create server with config
    .run(); // create server with config and run

fsServer.bindRequest('get', serverConst.LINK.GET_PORT, function (req, res) {
    res.end(JSON.stringify({
        HTTP_PORT,
        WS_PORT
    }));
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
