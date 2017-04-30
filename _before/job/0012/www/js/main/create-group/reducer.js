/**
 * Created by dmitry.turovtsov on 12.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const includedInNewGroupUsersState = (() => {
    function setIncludingUserInNewGroup(state, action) {
        const {needInclude, phoneNumber} = action.payload;
        const {items} = state;

        if (needInclude) {
            items.push(phoneNumber);
        } else {
            items.splice(items.indexOf(phoneNumber), 1);
        }

        return {...state};
    }

    function toggleIncludingUserInNewGroup(state, action) {
        const {phoneNumber} = action.payload;
        const {items} = state;
        const includeIndex = items.indexOf(phoneNumber);

        if (includeIndex === -1) {
            items.push(phoneNumber);
        } else {
            items.splice(includeIndex, 1);
        }

        return {...state};
    }

    const initialState = {
        items: []
    };

    return (state = initialState, action) => {
        switch (action.type) {
            case viewConst.type.setIncludingUserInNewGroup:
                return setIncludingUserInNewGroup(state, action);

            case viewConst.type.toggleIncludingUserInNewGroup:
                return toggleIncludingUserInNewGroup(state, action);

            case viewConst.type.resetIncludedUserInNewGroup:
                return {...state, items: []};

            default:
                return state;
        }
    };
})();

const creatingNewGroupState = (() => {
    const initialState = {
        isInProgress: false
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.createNewGroup) {
            return {
                ...state,
                isInProgress: action.payload.isInProgress
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
        if (action.type === viewConst.type.setCreateGroupViewVisible) {
            return {
                ...state,
                isVisible: action.payload.isVisible
            };
        }

        return state;
    };
})();

export default combineReducers({
    includedInNewGroupUsersState,
    creatingNewGroupState,
    viewVisibleState
});
