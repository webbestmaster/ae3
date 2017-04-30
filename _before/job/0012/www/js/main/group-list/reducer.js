/**
 * Created by dmitry.turovtsov on 13.04.2017.
 */

import {combineReducers} from 'redux';

import viewConst from './const.json';

const groupListItemsState = (() => {
    const initialState = {
        isInProgress: false,
        items: []
    };

    return (state = initialState, action) => {
        if (action.type === viewConst.type.updateGroups) {
            const {isInProgress, items = state.items} = action.payload;

            return {
                ...state,
                isInProgress,
                items
            };
        }

        return state;
    };
})();

export default combineReducers({
    groupListItemsState
});
