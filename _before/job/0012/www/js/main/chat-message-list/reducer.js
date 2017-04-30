/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import React from 'react';
import {combineReducers} from 'redux';

// import _ from 'lodash';
import _ from 'lodash';

import viewConst from './const.json';

// import chatMessageState from './chat-message/reducer';

const messagesState = (() => {
    const initialState = {
        items: []
    };

    return (state = initialState, action) => {
        const {items} = state;

        if (action.type === viewConst.type.addMessage) {
            items.push(action.payload);

            return {
                ...state
            };
        }

        if (action.type === viewConst.type.updateMessage) {
            const {viewId} = action.payload;
            const item = _.find(items, {viewId});

            items.splice(items.indexOf(item), 1);
            items.push(action.payload);

            return {
                ...state
            };
        }

        if (action.type === viewConst.type.updateMessages) {
            // add new messages to current list
            _.each(action.payload.messages, newMessage => {
                const {text, sender, sendTime} = newMessage;
                // check for newMessage is in list

                if (_.find(items, {text, sender, sendTime})) {
                    return;
                }

                items.push(newMessage);
            });

            return {
                ...state
            };
        }

        return state;
    };
})();

export default combineReducers({
    messagesState
});
