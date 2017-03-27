const mainConst = require('./../../../../_main/const.json');
import ajax from './../lib/internal/ajax';
import {userModel} from './../api/user-model';

const api = {

    getHostName() {
        return Promise.resolve(window.location.hostname);
    },

    getServerInfo() {
        return window
            .fetch(mainConst.LINK.GET_SERVER_INFO)
            .then(stream => stream.json())
    },

    initializeOfferGame(data) {

        return ajax
            .post(mainConst.LINK.INITIALIZE_OFFER_GAME, data)
            .then(JSON.parse);

    },

    connectToOfferGame(offerGameId) {

        Promise.all([
            api.getHostName(),
            api.getServerInfo()
        ]).then(([hostname, serverInfo]) => {

            const websocket = new WebSocket('ws://' + hostname + ':' + serverInfo.WS_PORT);

            userModel.setupWebSocket(websocket).then(() => {
                console.log('////////////////////////');
                console.log('---> connected to webSocket');
                console.log('url mainConst.LINK.CONNECT_TO_OFFER_GAME');
                console.log('send token id');
                console.log('and offerGameId');
                console.log('to connect to room');
                console.log('////////////////////////');
            });

        });

    }

};

export default api;
