// @flow

/* global window */

import type {OnResizeType} from '../action';
import {systemConst} from '../const';

type ScreenWidthNameType = 'desktop' | 'tablet' | 'mobile';

const screenMinWidth: {[key: ScreenWidthNameType]: number} = {
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

function getScreenState(width: number, height: number): ScreenType {
    return {
        width,
        height,
        name: getScreenName(width),
        ltThen: getLtThen(width)
    };
}

const {clientWidth, clientHeight} = window.document.documentElement;

const defaultScreenState = getScreenState(clientWidth, clientHeight);

export default (screenState: ScreenType = defaultScreenState, {type, payload}: OnResizeType): ScreenType => {
    if (type !== systemConst.action.type.resize) {
        return screenState;
    }

    const {width, height} = payload;

    if (screenState.width === width && screenState.height === height) {
        return screenState;
    }

    return getScreenState(width, height);
};
