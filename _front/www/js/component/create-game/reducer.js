import {combineReducers} from 'redux';

import viewConst from './const';

const {SET_GAME_CREATING_PROPERTY} = viewConst;

const initialState = {
    name: '__default_game_name__',
    password: '__default_game_password__',
    map: '__here_is_map_with_full_data__',
    type: '__game_type__'
};

function gameCreating(state = initialState, action) {

    if (action.type === SET_GAME_CREATING_PROPERTY) {
        const {key, value} = action;
        return {
            ...state,
            key,
            value
        };
    }

    return state;

}

export default combineReducers({
    gameCreating
});
