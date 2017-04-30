/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const initialState = {
    isInProgress: false
};

function addPhoneNumberState(state = initialState, action) {
    if (action.type === viewConst.type.addPhoneNumber) {
        return {
            ...state,
            isInProgress: action.payload.isInProgress
        };
    }

    return state;
}

export default combineReducers({
    addPhoneNumberState
});
