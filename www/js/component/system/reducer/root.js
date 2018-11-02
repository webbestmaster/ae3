// @flow

/* global window */

import {combineReducers} from 'redux';
import {screen, type ScreenType} from './screen';
import {scroll, type ScrollType} from './scroll';
import type {ActionDataType} from '../../../redux-store-provider/type';

export type SystemType = {|
    +screen: ScreenType,
    +scroll: ScrollType,
|};

type ReduceMapType = {|
    +screen: (screenState: ScreenType, actionData: ActionDataType) => ScreenType,
    +scroll: (scrollState: ScrollType, actionData: ActionDataType) => ScrollType,
|};

const system = combineReducers<ReduceMapType, SystemType>({
    screen,
    scroll,
});

export {system};
