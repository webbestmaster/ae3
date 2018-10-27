// @flow

/* global window */

import {combineReducers} from 'redux';
import {screen, type ScreenType} from './screen';

export const system = combineReducers({
    screen
});

export type SystemType = {|
    +screen: ScreenType
|};
