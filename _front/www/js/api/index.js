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

        userModel.getTokenId();
        debugger





    }

};

export default api;
