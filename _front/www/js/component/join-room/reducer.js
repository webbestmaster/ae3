import {combineReducers} from 'redux';

import viewConst from './const';

const {SHOW_AVAILABLE_ROOMS} = viewConst;

const initialState = {
    isLoadingRooms: true,
    roomIds: []
};

function availableRooms(state = initialState, action) {

    if (action.type === SHOW_AVAILABLE_ROOMS) {
        console.log('availableRooms.reducer');
        console.log(action);
        return {
            ...state,
            isLoadingRooms: action.isLoadingRooms,
            roomIds: action.roomIds
        };
    }

    return state;

}

export default combineReducers({
    availableRooms
});
