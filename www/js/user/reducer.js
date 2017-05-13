import {combineReducers} from 'redux';
const userConst = require('./const.json');

const idState = (() => {
    const initialState = {
        id: 'user-id-' + Math.random()
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

export default combineReducers({
    idState
});
