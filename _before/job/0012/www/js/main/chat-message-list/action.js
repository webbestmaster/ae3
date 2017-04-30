/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import viewConst from './const.json';

import generateId from './../../lib/generate-id';

import userModel from './../../model/user';

export const addMessage = (() => {
    // TODO: group's name for chat type user to user is static, save group's id to database or localStorage or etc...
    const groupNames = {};

    return (text, type, to) => {
        const viewId = generateId();
        const sender = userModel.getPhoneNumber();

        return dispatch => {
            const messageObject = {
                session: userModel.getSessionId(),
                messageText: text
            };

            const phoneNumber = '';

            switch (type) {
                // case viewConst.chat.type.user:
                //
                // phoneNumber = to;
                //
                // if (groupNames[to]) {
                // messageObject.group = groupNames[to];
                // } else {
                // messageObject.phoneNumber = to;
                // }
                //
                // break;
                case viewConst.chat.type.group:
                    messageObject.group = to;
                    break;

                default:
                    throw new Error('ERROR: can not detect message type');
            }

            const now = Date.now();

            dispatch({
                type: viewConst.type.addMessage,
                payload: {
                    viewId,
                    sender,
                    toGroup: messageObject.group || '',
                    toUser: phoneNumber,
                    text,
                    isInProgress: 1,
                    sendTime: now,
                    receiveTime: 0
                }
            });

            gapi.client.messaging
                .sendMessage(messageObject)
                .execute(result => {
                    if (result.error) {
                        console.error('ERROR: message has not been received!!!');
                    }

                    groupNames[to] = result.group;

                    dispatch({
                        type: viewConst.type.updateMessage,
                        payload: {
                            viewId,
                            sender,
                            toGroup: result.group || '',
                            toUser: phoneNumber,
                            text,
                            isInProgress: 0,
                            sendTime: now,
                            receiveTime: Number(result.datetime)
                        }
                    });
                });
        };
    };
})();
