// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../app-reducer';
import style from './style.scss';
import isString from 'lodash/isString';

const iconsReqContext = require.context('./list/', true, /\.svg$/);

const iconMap = {};

iconsReqContext.keys().forEach((fileName: string) => {
    Object.assign(iconMap, {[fileName.replace('./', '').replace('.svg', '')]: iconsReqContext(fileName)});
});

console.log(iconMap);

function getIconPath(iconType: string): string {
    const iconPath = iconMap[iconType];

    if (isString(iconPath)) {
        return iconPath;
    }

    console.error('can not get icon with type:', iconType);

    return '';
}

type PropsType = {|
    src: 'online-game' | 'offline-game',
    className?: string
|};

type StateType = {||};

class Icon extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <div
                style={{backgroundImage: 'url(' + getIconPath(props.src) + ')'}}
                className={style.wrapper + additionClass}
            />
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(Icon);
