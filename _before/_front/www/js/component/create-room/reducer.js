import {combineReducers} from 'redux';

const viewConst = require('./const.json');

const {SET_GAME_CREATING_PROPERTY} = viewConst;
const {NAME, PASSWORD, MAP, TYPE} = viewConst.GAME_PROPERTY;

const defaultMap = require('./../../../_main/map/default-maps/my-first-map.json');

const initialState = {
    [NAME]: '__default_game_name__',
    [PASSWORD]: '__default_game_password__',
    [MAP]: JSON.stringify(defaultMap),
    [TYPE]: '__game_type__'
};

function setting(state = initialState, action) {

    if (action.type === SET_GAME_CREATING_PROPERTY) {
        const {key, value} = action;
        return {
            ...state,
            [key]: value
        };
    }

    return state;

}

export default combineReducers({
    setting
});
