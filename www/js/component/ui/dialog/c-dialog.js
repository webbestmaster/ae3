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
|};

export function Dialog({isOpen, children, onClick}: PropsType): Node {
    const handleOnClick = onClick || ((): null => null);

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
