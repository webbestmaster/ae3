import {combineReducers} from 'redux';
import createReducer from './../../lib/create-reducer';
import {setShopVisible} from './action';
const viewConst = require('./const.json');

export default combineReducers({
    visibleState: createReducer({isVisible: false}, viewConst.type.setShopVisible)
});
