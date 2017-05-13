import {combineReducers} from 'redux';

import viewConst from './const.json';

const {resize} = viewConst.type;

import {onResizeScreen} from './action';

const screenState = (() => {
    const screenSize = onResizeScreen().payload;

    const initialState = {
        width: screenSize.width,
        height: screenSize.height
    };

    return (state = initialState, action) => {
        if (action.type === resize) {
            return {
                ...state,
                width: action.payload.width,
                height: action.payload.height
            };
        }

        return state;
    };
})();


export default combineReducers({
    screenState
});
