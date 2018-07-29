// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {GameDataType} from '../../model/unit';
import type {MapType} from '../../../../maps/type';
import find from 'lodash/find';

import armorImage from './i/armor.svg';
import {isNotString} from '../../../../lib/is';
import {getUserColor} from '../../model/helper';

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

const landscapeIconsReqContext = require.context('./i/landscape', true, /\.svg$/);

const landscapeIconMap = {};

landscapeIconsReqContext.keys().forEach((fileName: string) => {
    landscapeIconMap[fileName.replace('./', '').replace('.svg', '')] = landscapeIconsReqContext(fileName);
});

const buildingIconsReqContext = require.context('./i/building', true, /\.svg$/);

const buildingIconMap = {};

buildingIconsReqContext.keys().forEach((fileName: string) => {
    buildingIconMap[fileName.replace('./', '').replace('.svg', '')] = buildingIconsReqContext(fileName);
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
                <img className={style.armor_symbol} src={armorImage}/>
            </div>
        );
    }

    // eslint-disable-next-line complexity
    getImageSrc(): string {
        const view = this;
        const {props} = view;
        const {map, x, y} = props;

        const buildingOnPlace = find(props.gameData.buildingList, {attr: {x, y}}) || null;

        if (buildingOnPlace === null) {
            return landscapeIconMap[map.landscape[y][x]];
        }

        const buildingAttr = buildingOnPlace.attr;
        const buildingType = buildingAttr.type;

        if (['farm-destroyed', 'well', 'temple'].includes(buildingType)) {
            return buildingIconMap[buildingType];
        }

        const buildingUserId = buildingAttr.userId;

        if (isNotString(buildingUserId)) {
            return buildingIconMap[buildingType + '-gray'];
        }

        const userColor = getUserColor(buildingUserId, props.gameData.userList);

        if (userColor === null) {
            console.error('User color is not defined');
            return buildingIconMap[buildingType + '-gray'];
        }

        return buildingIconMap[buildingType + '-' + userColor];
    }

    render(): Node {
        const view = this;

        return (
            <div className={style.wrapper} style={{backgroundImage: 'url(' + view.getImageSrc() + ')'}}>
                {view.renderArmorData()}
            </div>
        );
    }
}
