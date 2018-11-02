// @flow

/* global window */

import {combineReducers} from 'redux';
import {screen, type ScreenType} from './screen';
import type {ActionDataType} from '../../../redux-store-provider/type';

export type SystemType = {|
    +screen: ScreenType,
|};

type ReduceMapType = {|
    +screen: (screenState: ScreenType, actionData: ActionDataType) => ScreenType,
|};

export const system = combineReducers<ReduceMapType, SystemType>({
    screen,
});
