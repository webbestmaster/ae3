import {combineReducers} from 'redux';

import viewConst from './const';

const {UPDATE_AVAILABLE_ROOMS} = viewConst;

const initialState = {
    isLoaded: false,
    roomIds: []
};

function availableRooms(state = initialState, action) {

    if (action.type === UPDATE_AVAILABLE_ROOMS) {
        console.log('availableRooms.reducer');
        console.log(action);
        return {
            ...state,
            isLoaded: action.isLoaded,
            roomIds: action.roomIds
        };
    }

    return state;

}

export default combineReducers({
    availableRooms
});
