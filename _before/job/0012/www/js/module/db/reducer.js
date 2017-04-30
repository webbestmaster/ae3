import {combineReducers} from 'redux';

import dbConst from './const.json';

import chatMessageListConst from '../../main/chat-message-list/const.json';

let dbMaster = null;

import sha1 from 'sha1';

import _ from 'lodash';

const dbInitState = (() => {
    const initialState = {
        isInProgress: false,
        db: null
    };

    return (state = initialState, action) => {
        if (action.type === dbConst.type.initializeDb) {
            const {db, isInProgress} = action.payload;

            if (db) {
                dbMaster = db;
            }

            return {
                ...state,
                isInProgress,
                db
            };
        }

        return state;
    };
})();


const getTableState = (() => {
    const initialState = {
        isInProgress: false,
        received: [],
        sent: []
    };

    return (state = initialState, action) => {
        if (action.type === dbConst.type.getTables) {
            const {received = state.received, sent = state.sent, isInProgress} = action.payload;

            return {
                ...state,
                isInProgress,
                received,
                sent
            };
        }

        return state;
    };
})();


function dbSavedDataState(state = null, action) {
    if (action.type === chatMessageListConst.type.updateNewMessages) {
        updateMessages(dbConst.table.messages.received, action.payload.newMessages);
    }

    if (action.type === chatMessageListConst.type.addMessage ||
        action.type === chatMessageListConst.type.updateMessage) {
        updateMessage(dbConst.table.messages.sent, action.payload);
    }

    return state;
}


export default combineReducers({
    dbInitState,
    dbSavedDataState,
    getTableState
});


// Helpers
function updateMessages(tableName, messages) {
    let promise = Promise.resolve();

    messages.forEach(message => {
        promise = promise.then(() => updateMessage(tableName, message));
    });

    return promise;
}

function updateMessage(tableName, message) {
    const hash = getMessageHash(message);

    return dbMaster.read(tableName, 'hash', hash).then(rows => {
        if (rows.length > 1) {
            throw new Error('WAT?! The hash should be unique!');
        }

        const row = rows[0];

        if (!row) {
            return dbMaster.create(tableName, dbConst.table.messages.fields, [
                hash,
                message.text,
                message.sender,
                message.toUser,
                message.toGroup,
                message.isInProgress,
                message.sendTime,
                message.receiveTime
            ]);
        }

        if (_.isEqual(normalizeMessage(row), normalizeMessage(message))) {
            return null;
        }

        return dbMaster.delete(tableName, 'hash', hash).then(() => updateMessage(tableName, message));
    });
}

function getMessageHash(messageOrRow) {
    return sha1(messageOrRow.text + messageOrRow.sendTime).substr(0, 7);
}

function normalizeMessage(messageOrRow) {
    const {text, sender, toUser, toGroup, isInProgress, sendTime, receiveTime} = messageOrRow;

    return {text, sender, toUser, toGroup, isInProgress, sendTime, receiveTime};
}
