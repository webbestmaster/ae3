const BaseModel = require('./../../js/base/base-model');

const props = {
    map: 'map',
    localization: 'localization',
    landscape: 'landscape',
    buildings: 'buildings',
    units: 'units',
    players: 'players'
};


class GameModel extends BaseModel {
    constructor() {
        super();

        this.set({
            [props.players]: []
        });
    }

    setMap(mapJSON) {
        const game = this;

        game.set({
            [props.localization]: mapJSON.localization,
            [props.landscape]: mapJSON.layer.landscape,
            [props.buildings]: mapJSON.layer.buildings,
            [props.units]: mapJSON.layer.units,
        });
    }

    addPlayer(player) {
        // get id and etc.
    }

    getState() {

        const game = this;

        return game.getAllAttributes();

    }

}

module.exports.model = GameModel;
