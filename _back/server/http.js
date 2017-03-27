
//////
// Starting
//////

const FsServer = require('fs-server');

const mainConst = require('./../../_main/const.json');
const backConst = require('./../const');

const {HTTP_PORT, WS_PORT} = backConst;

const fsServerConfig = {
    root: './../_front/dist/', // path to front-end part of site
    port: HTTP_PORT // optional, recommended this, or do not use this field
    // page404: 'custom-404-page/index.html' // optional, path to custom 404 page
};

const fsServer = new FsServer(fsServerConfig) // create server with config
    .run(); // and run

//////
// Routing
//////

// get info about server
fsServer.bindRequest('get', mainConst.LINK.GET_SERVER_INFO, (req, res) => {
    res.end(JSON.stringify({
        HTTP_PORT,
        WS_PORT
    }));
});

// initialize game
const GameOffer = require('./../initialize-game-offer/');
const gameOffer = new GameOffer();
fsServer.bindRequest('post', mainConst.LINK.INITIALIZE_OFFER_GAME, gameOffer.initializeGameOffer);

//////
// Exports
//////

module.exports = {
    httpServer: fsServer.get(fsServer.KEYS.HTTP_SERVER),
    fsServer
};
