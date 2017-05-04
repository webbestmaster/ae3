import {combineReducers} from 'redux';
import viewConst from './const.json';
const mapGuide = require('./../../maps/map-guide.json');

const getRoomsState = (() => {
    const initialState = {
        isInProgress: false,
        usersData: [],
        chatMessages: [],
        unitLimit: mapGuide.settings.unitLimitList[0],
        defaultMoney: mapGuide.settings.defaultMoneyList[0]
    };

    return (state = initialState, {type, payload}) => {
        if (type === viewConst.type.getRoomState) {
            const {isInProgress} = payload;

            if (isInProgress) {
                return {...state, isInProgress};
            }

            return {
                ...state,
                ...payload
            };
        }

        return state;
    };
})();

export default combineReducers({
    getRoomsState
});
