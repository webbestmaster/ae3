// @flow

import type {Node} from 'react';
import React from 'react';
import {Fade} from '../fade/c-fade';
import style from './style.scss';
import {forceWindowUpdate} from '../fade/helper';
import {DialogCloseButton} from './dialog-close-button/c-dialog-close-button';
import {Scroll} from '../scroll/c-scroll';

type PropsType = {|
    +isOpen: boolean,
    // eslint-disable-next-line id-match
    +children: React$Node,
    +onClick?: () => mixed | Promise<mixed>,
    +hasCloseButton?: boolean,
    +isModal?: boolean, // default false, if isModal: true, fade is disabled to click
|};

export function Dialog({isOpen, children, onClick: handleOnClick, isModal, hasCloseButton}: PropsType): Node {
    const fadeProps = {
        isShow: isOpen,
        onEnter: forceWindowUpdate,
        // onEntering={() => console.log('onEntering')}
        onEntered: forceWindowUpdate,
        onExit: forceWindowUpdate,
        // onExiting={() => console.log('onExiting')}
        onExited: forceWindowUpdate,
    };

    const dialogContentVisible = <Scroll className={style.dialog_content__visible}>{children}</Scroll>;
    const dialogContentHidden = <div className={style.dialog_content__hidden}>{children}</div>;

    if (hasCloseButton === true && handleOnClick) {
        return (
            <Fade {...fadeProps}>
                <div className={style.dialog_wrapper}>
                    <div className={style.dialog_content}>
                        <DialogCloseButton onClick={handleOnClick}/>
                        {dialogContentHidden}
                        {dialogContentVisible}
                    </div>
                </div>
            </Fade>
        );
    }

    if (!handleOnClick) {
        return (
            <Fade {...fadeProps}>
                <div className={style.dialog_wrapper}>
                    <div className={style.dialog_content}>
                        {dialogContentHidden}
                        {dialogContentVisible}
                    </div>
                </div>
            </Fade>
        );
    }

    if (isModal === true) {
        return (
            <Fade {...fadeProps}>
                <div className={style.dialog_wrapper}>
                    <button
                        className={style.dialog_content}
                        type="button"
                        onClick={handleOnClick}
                        onKeyPress={handleOnClick}
                    >
                        {dialogContentHidden}
                        {dialogContentVisible}
                    </button>
                </div>
            </Fade>
        );
    }

    return (
        <Fade {...fadeProps}>
            <button type="button" onClick={handleOnClick} onKeyPress={handleOnClick} className={style.dialog_wrapper}>
                <div className={style.dialog_content}>
                    {dialogContentHidden}
                    {dialogContentVisible}
                </div>
            </button>
        </Fade>
    );
}
