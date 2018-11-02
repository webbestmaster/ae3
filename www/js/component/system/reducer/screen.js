// @flow

/* global window */

import {systemConst} from '../const';
import type {ActionDataType} from '../../../redux-store-provider/type';

type ScreenWidthNameType = 'desktop' | 'tablet' | 'mobile';

const screenMinWidth: {[key: ScreenWidthNameType]: number} = {
    desktop: 1280,
    tablet: 768,
    mobile: 320,
};

export type ScreenType = {|
    width: number,
    height: number,
    name: ScreenWidthNameType,
    ltThen: Array<ScreenWidthNameType>,
    isLandscape: boolean,
    isPortrait: boolean
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
    const isLandscape = width > height; // use >, do not use >=, if width === height it is portrait

    return {
        width,
        height,
        name: getScreenName(width),
        ltThen: getLtThen(width),
        isLandscape,
        isPortrait: !isLandscape,
    };
}

const {clientWidth, clientHeight} = window.document.documentElement;

const defaultScreenState = getScreenState(clientWidth, clientHeight);

export function screen(screenState: ScreenType = defaultScreenState, actionData: ActionDataType): ScreenType {
    if (actionData.type !== systemConst.action.type.resize) {
        return screenState;
    }

    if (typeof actionData.payload === 'undefined') {
        return screenState;
    }

    const {width, height} = actionData.payload;

    if (screenState.width === width && screenState.height === height) {
        return screenState;
    }

    return getScreenState(width, height);
}
