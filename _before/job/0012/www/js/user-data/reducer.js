/**
 * Created by dmitry.turovtsov on 18.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const userDataState = (() => {
    const initialState = {
        isInProgress: false,
        name: 'NO NAME',
        phone: 'NO PHONE'
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.getUserData) {
            return {
                ...state,
                isInProgress: action.payload.isInProgress,
                name: action.payload.name || state.name,
                phone: action.payload.phone || state.phone
            };
        }

        return state;
    };
})();


export default combineReducers({
    userDataState
});
