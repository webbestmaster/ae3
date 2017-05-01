import {combineReducers} from 'redux';

import viewConst from './const.json';

const getRoomsState = (() => {
    const initialState = {
        isInProgress: false,
        usersData: [],
        chatMessages: []
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.getRoomState) {
            const {isInProgress, usersData, chatMessages} = action.payload;

            if (isInProgress) {
                return {...state, isInProgress};
            }

            return {
                ...state,
                isInProgress,
                usersData,
                chatMessages
            };
        }

        return state;
    };
})();

export default combineReducers({
    getRoomsState
});
