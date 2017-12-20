import {combineReducers} from 'redux';
import createReducer from './../lib/create-reducer';
const userConst = require('./const.json');

export default combineReducers({
    idState: createReducer({id: 'user-id-' + Math.random() + '-not-defined'}, userConst.type.setId),
    roomIdState: createReducer({instanceId: 'room-id-is-not-defined'}, userConst.type.setRoomId),
    publicIdState: createReducer({ publicId: 'public-id-is-not-defined'}, userConst.type.setPublicId)
});
