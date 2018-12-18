// @flow

import type {Node} from 'react';
import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import style from './style.scss';

const fadeTimeOut = 300;

const fadeClassNames = {
    enter: style.fade__enter,
    enterActive: style.fade__enter__active,
    exit: style.fade__exit,
};

type PropsType = {|
    +isShow: boolean,
    +children: Node | Array<Node>,

    +onEnter?: () => mixed,
    +onEntering?: () => mixed,
    +onEntered?: () => mixed,
    +onExit?: () => mixed,
    +onExiting?: () => mixed,
    +onExited?: () => mixed,
|};

export function Fade({isShow, children, onEnter, onEntering, onEntered, onExit, onExiting, onExited}: PropsType): Node {
    return (
        <TransitionGroup>
            {isShow ?
                <CSSTransition
                    key="css-transition"
                    timeout={fadeTimeOut}
                    classNames={fadeClassNames}
                    onEnter={onEnter}
                    onEntering={onEntering}
                    onEntered={onEntered}
                    onExit={onExit}
                    onExiting={onExiting}
                    onExited={onExited}
                >
                    {children}
                </CSSTransition> :
                null}
        </TransitionGroup>
    );
}
