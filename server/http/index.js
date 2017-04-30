
// Starting

const FsServer = require('fs-server');

const httpApi = require('./api');
//
const httpConst = require('./../../www/main/http-const.json');
// const mainConst = require('./../../_front/www/_main/const.json');
const serverConst = require('./../server-const');

const {httpPort} = serverConst;

const fsServerConfig = {
    root: './../dist/', // path to front-end part of site
    port: httpPort // optional, recommended this, or do not use this field
    // page404: 'custom-404-page/index.html' // optional, path to custom 404 page
};

const fsServer = new FsServer(fsServerConfig) // create server with config
    .run(); // and run

// Routing

// get info about server
fsServer.bindRequest('get', httpConst.route.getServerInfo, httpApi.getInfo);
fsServer.bindRequest('post', httpConst.route.createRoom, httpApi.createRoom);
fsServer.bindRequest('get', httpConst.route.getAvailableRooms, httpApi.getAvailableRooms);

/*

fsServer.bindRequest('get', mainConst.LINK.GET_AVAILABLE_ROOMS, httpApi.getAvailableRooms);
*/

// Exports

module.exports = {
    httpServer: fsServer.get(fsServer.KEYS.HTTP_SERVER),
    fsServer
};
