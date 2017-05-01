import {combineReducers} from 'redux';

import viewConst from './const.json';

const availableRoomsState = (() => {
    const initialState = {
        isInProgress: false,
        roomIds: []
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.getAvailableRooms) {
            return {
                ...state,
                isInProgress: action.payload.isInProgress,
                roomIds: action.payload.roomIds
            };
        }

        return state;
    };
})();

export default combineReducers({
    availableRoomsState
});
