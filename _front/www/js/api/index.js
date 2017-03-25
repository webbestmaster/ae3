const mainConst = require('./../../../../_main/const.json');
import ajax from './../lib/internal/ajax';

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
            .then(serverData => console.log(serverData));

    }

};

export default api;
