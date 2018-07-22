// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {LandscapeType} from './../../../../maps/type';

type StateType = {||};
type PropsType = {|
    tile: LandscapeType
|};

const iconsReqContext = require.context('./i/', true, /\.svg$/);

const iconMap = {};

iconsReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            iconMap,
            {[fileName.replace('./', '').replace('.svg', '')]: iconsReqContext(fileName)}
        );
    });

export default class LandscapeInfo extends Component<PropsType, StateType> {
    constructor() {
        super();

        const view = this;

        view.state = {};
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <div className={style.wrapper}>
                <img
                    className={style.image}
                    src={iconMap[props.tile]}
                    alt=""
                />
            </div>
        );
    }
}
