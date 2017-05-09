const BaseModel = require('./../../js/base/base-model');

const attr = {
    initialData: 'initial-data',
    unit: 'unit',
    player: 'player'
};

class GameModel extends BaseModel {

    setInitialData(initialData) {
        const game = this;

        game.set(attr.initialData, initialData);
    }

    addPlayers(usersData) {
        this.set({[attr.player]: usersData});
    }

    getState() {
        return this.getAllAttributes();
    }

}

module.exports.model = GameModel;
