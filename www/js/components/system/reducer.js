// @flow

/* global window */

import {combineReducers} from 'redux';
import type {OnResizeType} from './action';
import {systemConst} from './const';

type ScreenWidthNameType = 'desktop' | 'tablet' | 'mobile';

const screenMinWidth = {
    desktop: 1280,
    tablet: 768,
    mobile: 320
};

export type ScreenType = {|
    width: number,
    height: number,
    name: ScreenWidthNameType,
    ltThen: Array<ScreenWidthNameType>
|};

function getScreenName(screenWidth: number): ScreenWidthNameType {
    let screenName = 'mobile';

    Object.keys(screenMinWidth).every(
        (screenNameInList: ScreenWidthNameType): boolean => {
            if (screenWidth >= screenMinWidth[screenNameInList]) {
                screenName = screenNameInList;
                return false;
            }

            return true;
        }
    );

    return screenName;
}

function getLtThen(screenWidth: number): Array<ScreenWidthNameType> {
    const ltThenList = [];

    Object.keys(screenMinWidth).forEach((screenName: ScreenWidthNameType) => {
        if (screenWidth < screenMinWidth[screenName]) {
            ltThenList.push(screenName);
        }
    });

    return ltThenList;
}

const {clientWidth, clientHeight} = window.document.documentElement;
const defaultScreenState: ScreenType = {
    width: clientWidth,
    height: clientHeight,
    name: getScreenName(clientWidth),
    ltThen: getLtThen(clientWidth)
};

// module
export type SystemType = {|
    +screen: ScreenType
|};

export default combineReducers({
    screen: (screenState: ScreenType = defaultScreenState, {type, payload}: OnResizeType): ScreenType => {
        if (type !== systemConst.action.type.resize) {
            return screenState;
        }

        const {width, height} = payload;

        if (screenState.width === width && screenState.height === height) {
            return screenState;
        }

        return {
            width,
            height,
            name: getScreenName(width),
            ltThen: getLtThen(width)
        };
    }
});
