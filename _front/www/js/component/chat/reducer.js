import {combineReducers} from 'redux';

import viewConst from './const';

const {CHAT_ADD_MESSAGE} = viewConst;

const list = [];

const initialState = {
    list
};

function messages(state = initialState, action) {

    if (action.type === CHAT_ADD_MESSAGE) {

        list.push(action.messageData);

        return {
            ...state,
            list
        };

    }

    return state;

}

export default combineReducers({
    messages
});
