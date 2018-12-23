// @flow

/* global window, CustomEvent */

import React from 'react';

export const defaultSnackbarShowEventName = `show-snackbar-event ${Math.random()}`;

type OptionsType = {|
    timer: number,
    isModal: boolean,
    id: string | number,
|};

export const defaultSnackbarOptions: OptionsType = {
    timer: 6e3,
    isModal: false,
    id: Math.random(),
};

export type ShowSnackBarEventDetailType = {|
    ...OptionsType,
    +isShow: true,
    // eslint-disable-next-line id-match
    +content: React$Node,
    +handleOnHide: () => void,
|};

export type HideSnackBarEventDetailType = {|
    +isShow: false,
    +id: string | number,
|};

// eslint-disable-next-line id-match
export function showSnackBar(content: React$Node, options: OptionsType, customEventName: string): Promise<void> {
    return new Promise((resolve: () => void) => {
        const detail: ShowSnackBarEventDetailType = {
            ...options,
            isShow: true,
            content,
            handleOnHide: (): void => resolve(),
        };

        const customEvent = new CustomEvent(customEventName, {detail});

        window.dispatchEvent(customEvent);
    });
}

export function hideSnackBar(snackBarId: string | number, customEventName: string) {
    const detail = {
        isShow: false,
        id: snackBarId,
    };

    const customEvent = new CustomEvent(customEventName, {detail});

    window.dispatchEvent(customEvent);
}
