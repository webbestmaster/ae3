// @flow

import type {Node} from 'react';
import React from 'react';
import {Fade} from '../fade/c-fade';
import style from './style.scss';

type PropsType = {|
    +isOpen: boolean,
    // eslint-disable-next-line id-match
    +children: React$Node,
    +onClick?: () => mixed | Promise<mixed>,
    +isModal?: boolean, // default false, if isModal: true, fade is disabled to click
|};

export function Dialog({isOpen, children, onClick: handleOnClick, isModal}: PropsType): Node {
    if (!handleOnClick) {
        return (
            <Fade isShow={isOpen}>
                <div className={style.dialog_wrapper}>
                    <div className={style.dialog_content}>{children}</div>
                </div>
            </Fade>
        );
    }

    if (isModal === true) {
        return (
            <Fade isShow={isOpen}>
                <div className={style.dialog_wrapper}>
                    <button
                        className={style.dialog_content}
                        type="button"
                        onClick={handleOnClick}
                        onKeyPress={handleOnClick}
                    >
                        {children}
                    </button>
                </div>
            </Fade>
        );
    }

    return (
        <Fade isShow={isOpen}>
            <button type="button" onClick={handleOnClick} onKeyPress={handleOnClick} className={style.dialog_wrapper}>
                <div className={style.dialog_content}>{children}</div>
            </button>
        </Fade>
    );
}
