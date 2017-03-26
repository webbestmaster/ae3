const FsServer = require('fs-server');
const mainConst = require('./../_main/const.json');

const HTTP_PORT = process.env.PORT || 3000;
const WS_PORT = HTTP_PORT + 1;

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
const GameOffer = require('./initialize-game-offer/');
const gameOffer = new GameOffer();
fsServer.bindRequest('post', mainConst.LINK.INITIALIZE_OFFER_GAME, gameOffer.initializeGameOffer);


fsServer.bindRequest('post', mainConst.LINK.CONNECT_TO_OFFER_GAME, gameOffer.connectPlayerToOfferGame);

/*
 server.bindRequest('get', 'api/:class/:method', function (req, res, url, className, methodName) {
 res.end([className, methodName].join('+'));
 }, server);
 */


const WebSocketServer = require('ws').Server;

const httpServer = fsServer.get(fsServer.KEYS.HTTP_SERVER);

const webSocketServer = new WebSocketServer({server: httpServer, port: WS_PORT});

webSocketServer.on('connection', ws => {

    ws.on('message', inputStr => {
        console.log(inputStr);
    });

    ws.send('something');

});

