import {combineReducers} from 'redux';
import createReducer from './../lib/create-reducer';
import {resetState} from './action';
import shopState from './shop/reducer';
const viewConst = require('./const.json');

export default combineReducers({
    state: createReducer(resetState().payload, viewConst.type.setState),
    shopState
});
