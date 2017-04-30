import {combineReducers} from 'redux';

import gapiConst from './const.json';

const gapiClientInitState = (() => {
    const initialState = {
        client: null
    };

    return (state = initialState, action) => {
        if (action.type === gapiConst.type.initializeClient) {
            return {
                ...state,
                client: action.payload.client
            };
        }

        return state;
    };
})();

export default combineReducers({
    gapiClientInitState
});
