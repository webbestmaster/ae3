/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const updateContactListState = (() => {
    const initialState = {
        isInProgress: false,
        items: []
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.updateContactList) {
            const isInProgress = action.payload.hasOwnProperty('isInProgress') ?
                action.payload.isInProgress :
                state.isInProgress;

            return {
                ...state,
                isInProgress,
                items: action.payload.items || state.items
            };
        }

        return state;
    };
})();

const viewVisibleState = (() => {
    const initialState = {
        isVisible: false
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.setContactsViewVisible) {
            return {
                ...state,
                isVisible: action.payload.isVisible
            };
        }

        return state;
    };
})();

export default combineReducers({
    updateContactListState,
    viewVisibleState
});
