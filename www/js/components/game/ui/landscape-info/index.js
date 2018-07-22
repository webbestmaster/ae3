// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import find from 'lodash/find';
import type {GameDataType} from './../../model/unit';
import type {MapType} from './../../../../maps/type';

type StateType = {};
type PropsType = {|
    x: number,
    y: number,
    gameData: GameDataType,
    map: MapType
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
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {};
    }

    render(): Node {
        const view = this;
        const {props, state} = view;
        const {map, gameData, x, y} = props;

        console.warn('LandscapeInfo - show armor (and path reduce)');

        return (
            <div className={style.wrapper}>
                <div style={{display: 'none'}}>
                    {x}
                    {'/'}
                    {y}
                    {' - armor:' + gameData.armorMap.walk[y][x]}
                    {'- tile:' + map.landscape[y][x]}
                </div>
                <img
                    className={style.image}
                    src={iconMap[map.landscape[y][x]]}
                    alt=""
                />
            </div>
        );
    }
}
