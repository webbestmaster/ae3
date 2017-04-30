/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';
import chatMessageListConst from './../chat-message-list/const.json';

const sendMessageReceiverState = (() => {
    const initialState = {
        type: chatMessageListConst.chat.type.group,
        to: chatMessageListConst.chat.none
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.setTypeTo) {
            return {
                // here is reducer's states
                ...state,
                type: action.payload.type,
                to: action.payload.to
            };
        }

        return state;
    };
})();

export default combineReducers({
    sendMessageReceiverState
});
