import {combineReducers} from 'redux';

import viewConst from './const.json';

const availableRoomsState = (() => {
    const initialState = {
        isInProgress: false,
        roomIds: []
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.getAvailableRooms) {
            const {isInProgress} = action.payload;

            if (isInProgress) {
                return {...state, isInProgress};
            }

            return {
                ...state,
                isInProgress,
                roomIds: action.payload.roomIds
            };
        }

        return state;
    };
})();

export default combineReducers({
    availableRoomsState
});
