const mainConst = require('./../../../../_main/const.json');
import ajax from './../lib/internal/ajax';
// import {userModel} from './../api/user-model';

const api = {

    getHostName() {
        return Promise.resolve(window.location.hostname);
    },

    getServerInfo() {
        return window
            .fetch(mainConst.LINK.GET_SERVER_INFO)
            .then(stream => stream.json());
    },

    createRoom(data) {

        return ajax
            .post(mainConst.LINK.CREATE_ROOM, data)
            .then(JSON.parse);

    },

    getAvailableRooms() {

        return ajax
            .get(mainConst.LINK.GET_AVAILABLE_ROOMS)
            .then(JSON.parse);

    }

/*
    connectToOfferGame(offerGameId) {

        Promise.all([
            api.getHostName(),
            api.getServerInfo()
        ]).then(([hostname, serverInfo]) => {

            const websocket = new WebSocket('ws://' + hostname + ':' + serverInfo.WS_PORT);

            userModel.setupWebSocket(websocket).then(() => {
                userModel.sendMessage({
                    type: mainConst.MESSAGE.CONNECT_TO_OFFER_GAME,
                    id: offerGameId
                });
            });

        });

    }
*/

};

export default api;
