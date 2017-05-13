import {combineReducers} from 'redux';
const theConst = require('./const.json');

const theState = (() => {
    const initialState = {
        key: 'value'
    };

    return (state = initialState, {type, payload}) => {
        if (type === theConst.type.theType) {
            return {
                ...state,
                // reducer state
                payload
            };
        }

        return state;
    };
})();

export default combineReducers({
    theState
});
