/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const loginProgressState = (() => {
    const initialState = {
        isInProgress: false
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.switchLoginProgress) {
            return {
                ...state,
                isInProgress: action.payload.isInProgress
            };
        }

        return state;
    };
})();

export default combineReducers({
    loginProgressState
});
