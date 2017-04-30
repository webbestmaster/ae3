/**
 * Created by dmitry.turovtsov on 07.04.2017.
 */

/* global setTimeout */

import userModel from './../model/user';
import appConst from './../app-const.json';
import generateId from './../lib/generate-id';
import chatMessageListConst from './chat-message-list/const.json';
import _ from 'lodash';

import * as groupListAction from './group-list/action';

const extractNewMessages = (() => {
    let oldMessages = [];

    return messages => {
        const newMessages = messages.filter(message => {
            const {sendTime, text, sender} = message;

            return !_.find(oldMessages, {sendTime, text, sender});
        });

        oldMessages = messages;

        return newMessages;
    };
})();

export const setWatchingMessages = (() => {
    let watchingForMessagesIsEnable = false;

    function fetchMessages(dispatch, savedMessages) {
        if (!watchingForMessagesIsEnable) {
            return;
        }

        gapi.client.messaging.getAllMessages({
            session: userModel.getSessionId()
        }).execute(result => {
            setTimeout(() => fetchMessages(dispatch, savedMessages), appConst.timing.getAllMessagesFetchPeriod);

            if (result.error) {
                throw new Error('Error: can not fetch all messages');
            }

            const messages = (result.messages || [])
                .map(message => ({
                    viewId: generateId(),
                    text: message.text,
                    sender: message.sender,
                    toUser: userModel.getPhoneNumber(),
                    toGroup: message.group,
                    isInProgress: 0,
                    sendTime: Number(message.datetime),
                    receiveTime: Number(message.datetime)
                }));

            const newMessages = extractNewMessages(messages);

            if (newMessages.length) {
                dispatch({
                    type: chatMessageListConst.type.updateMessages,
                    payload: {
                        messages: messages.concat(savedMessages)
                    }
                });

                dispatch({
                    type: chatMessageListConst.type.updateNewMessages,
                    payload: {
                        newMessages
                    }
                });

                dispatch(groupListAction.updateGroups());
            }
        });
    }

    return (isEnable, savedMessages) => {
        // prevent to start/stop twice
        if (watchingForMessagesIsEnable === isEnable) {
            return null;
        }

        watchingForMessagesIsEnable = isEnable;

        if (isEnable) {
            return dispatch => fetchMessages(dispatch, savedMessages);
        }

        return null;
    };
})();
