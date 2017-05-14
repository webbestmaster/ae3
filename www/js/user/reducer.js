import {combineReducers} from 'redux';
const userConst = require('./const.json');

const idState = (() => {
    const initialState = {
        id: 'user-id-' + Math.random() + '-not-defined'
    };

    return (state = initialState, {type, payload}) => {
        if (type === userConst.type.setId) {
            return {
                ...state,
                id: payload.id
            };
        }

        return state;
    };
})();

const roomIdState = (() => {
    const initialState = {
        roomId: 'room-id-is-not-defined'
    };

    return (state = initialState, {type, payload}) => {
        if (type === userConst.type.setRoomId) {
            return {
                ...state,
                roomId: payload.roomId
            };
        }

        return state;
    };
})();

const publicIdState = (() => {
    const initialState = {
        publicId: 'public-id-is-not-defined'
    };

    return (state = initialState, {type, payload}) => {
        if (type === userConst.type.setPublicId) {
            return {
                ...state,
                publicId: payload.publicId
            };
        }

        return state;
    };
})();

export default combineReducers({
    idState,
    roomIdState,
    publicIdState
});
