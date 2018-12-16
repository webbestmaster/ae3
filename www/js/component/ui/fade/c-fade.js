// @flow

import type {Node} from 'react';
import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import style from './style.scss';

const fadeTimeOut = 500;

const fadeClassNames = {
    enter: style.fade__enter,
    enterActive: style.fade__enter__active,
    exit: style.fade__exit,
};

type PropsType = {|
    +isShow: boolean,
    +children: Node | Array<Node>,
|};

export function Fade({isShow, children}: PropsType): Node {
    return (
        <TransitionGroup>
            {isShow ?
                <CSSTransition key="css-transition" timeout={fadeTimeOut} classNames={fadeClassNames}>
                    {children}
                </CSSTransition> :
                null}
        </TransitionGroup>
    );
}
