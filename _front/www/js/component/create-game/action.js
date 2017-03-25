import viewConst from './const';

const {SET_GAME_CREATING_PROPERTY} = viewConst;

export function setGameCreatingProperty(key, value) {

    return {
        type: SET_GAME_CREATING_PROPERTY,
        key, value
    }

}
