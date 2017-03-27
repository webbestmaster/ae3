const path = require('path');

const requestBodyParser = require('./../lib/internal/request-body-parser');
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

        requestBodyParser(req, body => {

            const gameId = generateId();

            const gameData = JSON.parse(body);

            gameData.id = gameId;

            const room = new Room(gameData);

            console.log(gameData);

            res.end(JSON.stringify(gameData));

        });

    }

    connectPlayerToOfferGame(gameId) {

        console.log('connectPlayerToOfferGame');
        console.log(arguments);

    }

}

module.exports = GameOffer;
