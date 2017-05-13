const BaseModel = require('./../../js/base/base-model');

const attr = {
    initialData: 'initial-data',
    unit: 'unit',
    players: 'players',
    currentPlayer: 'current-payer'
};

class GameModel extends BaseModel {

    start() {
        const game = this;
        const players = game.get(attr.players);

        game.set(attr.currentPlayer, players[0]);
    }

    setInitialData(initialData) {
        const game = this;

        game.set(attr.initialData, initialData);
    }

    addPlayers(usersData) {
        this.set({[attr.players]: usersData});
    }

    getState() {
        return this.getAllAttributes();
    }

}

module.exports.model = GameModel;
