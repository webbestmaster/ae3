/**
 * Created by dmitry.turovtsov on 07.04.2017.
 */

import {combineReducers} from 'redux';

import addContactState from './add-contact/reducer';
import createNewGroupState from './create-group/reducer';
import contactsState from './contacts/reducer';
import sendMessageState from './send-message/reducer';
// import chatsState from './chats/reducer';
import chatMessageListState from './chat-message-list/reducer';
import groupListState from './group-list/reducer';
import userDataState from '../user-data/reducer';

export default combineReducers({
    addContactState,
    contactsState,
    sendMessageState,
    createNewGroupState,
    groupListState,
    chatMessageListState,
    // chatsState,
    userDataState
});
