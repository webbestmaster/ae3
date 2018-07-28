// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {GameDataType} from './../../model/unit';
import type {MapType} from './../../../../maps/type';

import armorImage from './i/armor.svg';

const fontReqContext = require.context('./i/font', true, /\.svg$/);

type FontImageMapType = {[key: string]: string};
const fontImageMap: FontImageMapType = {};

fontReqContext.keys().forEach((fileName: string) => {
    fontImageMap[fileName.replace('./', '').replace('.svg', '')] = fontReqContext(fileName);
});

type StateType = {};
type PropsType = {|
    x: number,
    y: number,
    gameData: GameDataType,
    map: MapType
|};

const iconsReqContext = require.context('./i/landscape', true, /\.svg$/);

const iconMap = {};

iconsReqContext.keys().forEach((fileName: string) => {
    Object.assign(iconMap, {[fileName.replace('./', '').replace('.svg', '')]: iconsReqContext(fileName)});
});

export default class LandscapeInfo extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {};
    }

    renderArmorData(): Node {
        const view = this;
        const {props} = view;
        const {gameData, x, y} = props;
        const armorValue = gameData.armorMap.walk[y][x]
            .toString()
            .split('')
            .reverse();

        return (
            <div className={style.armor}>
                {armorValue.map(
                    (char: string, index: number): Node => {
                        return (
                            <img
                                className={style.armor_symbol}
                                key={char + '/' + String(index)}
                                src={fontImageMap[char]}
                                alt=""
                            />
                        );
                    }
                )}
                <img className={style.armor_symbol} src={armorImage} />
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {map, x, y} = props;

        return (
            <div className={style.wrapper} style={{backgroundImage: 'url(' + iconMap[map.landscape[y][x]] + ')'}}>
                {view.renderArmorData()}
            </div>
        );
    }
}
