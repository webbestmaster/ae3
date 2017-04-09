const viewConst = require('./const.json');

const {SET_GAME_CREATING_PROPERTY} = viewConst;

export function setGameCreatingProperty(key, value) {

    return {
        type: SET_GAME_CREATING_PROPERTY,
        key, value
    };

}
