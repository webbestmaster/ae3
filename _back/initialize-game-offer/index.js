const path = require('path');

const FileMaster = require('./../lib/internal/file-master');
const fileMaster = new FileMaster();
const generateId = require('./../lib/internal/generate-id');
const Room = require('./../other/room').Room;

const offerGameConst = {
    file: {
        prefix: 'offered-game-'
    },
    path: {
        offerGame: './offer-game',
    }
};

class GameOffer {

    initializeGameOffer(req, res) {


    }

    connectPlayerToOfferGame(gameId) {

        console.log('connectPlayerToOfferGame');
        console.log(arguments);

    }

}

module.exports = GameOffer;
