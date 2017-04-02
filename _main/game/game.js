const BaseModel = require('./../core/base-model');

const gameConst = {
    map: 'const_map',
    players: 'const_players'
};

const modelDefaults = {
    [gameConst.players]: []
};

class Game extends BaseModel {

    constructor() {

        super();

        const model = this;

        model.set(modelDefaults);

    }

    addPlayer(player) {

        const players = this.get(gameConst.players);

        players.push(player);

    }

    addMap(map) {

        return this.set(gameConst.map, map);

    }

}

module.exports = Game;
