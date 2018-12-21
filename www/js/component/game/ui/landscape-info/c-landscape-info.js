// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {GameDataType} from '../../model/unit/unit';
import type {MapType} from '../../../../maps/type';
import find from 'lodash/find';
import {Canvas} from '../../../ui/canvas/c-canvas';
import {imageMap} from '../../image/image-map';

import armorImage from './i/armor.png';
import {isNotString} from '../../../../lib/is/is';
import {getUserColor} from '../../model/helper';
import {mapGuide} from '../../../../maps/map-guide';

import number0 from './i/font/0.png';
import number1 from './i/font/1.png';
import number2 from './i/font/2.png';
import number3 from './i/font/3.png';
import number4 from './i/font/4.png';
import number5 from './i/font/5.png';
import number6 from './i/font/6.png';
import number7 from './i/font/7.png';
import number8 from './i/font/8.png';
import number9 from './i/font/9.png';
import space from './i/font/space.png';

const numberList = [number0, number1, number2, number3, number4, number5, number6, number7, number8, number9];

type StateType = {};
type PropsType = {|
    x: number,
    y: number,
    gameData: GameDataType,
    map: MapType,
|};

export class LandscapeInfo extends Component<PropsType, StateType> {
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
                                key={char + '/' + String(index)}
                                className={style.armor_symbol}
                                src={numberList[parseInt(char, 10)] || space}
                                alt=""
                            />
                        );
                    }
                )}
                <img className={style.armor_symbol} src={armorImage} alt=""/>
            </div>
        );
    }

    // eslint-disable-next-line complexity, max-statements
    getImageSrc(): string {
        const view = this;
        const {props} = view;
        const {map, x, y} = props;

        const buildingOnPlace = find(props.gameData.buildingList, {attr: {x, y}}) || null;

        if (buildingOnPlace === null) {
            return imageMap.landscape[map.landscape[y][x]];
        }

        const buildingAttr = buildingOnPlace.attr;
        const buildingType = buildingAttr.type;

        if (
            [mapGuide.building.well.name, mapGuide.building.temple.name, mapGuide.building.farmDestroyed.name].includes(
                buildingType
            )
        ) {
            return imageMap.building[mapGuide.building[buildingType].spriteName];
        }

        const buildingUserId = buildingAttr.userId;

        const castlePostfix = buildingType === mapGuide.building.castle.name ? '-square' : '';

        if (isNotString(buildingUserId)) {
            return imageMap.building[buildingType + '-gray' + castlePostfix];
        }

        const userColor = getUserColor(buildingUserId, props.gameData.userList);

        if (userColor === null) {
            console.error('User color is not defined');
            return imageMap.building[buildingType + '-gray' + castlePostfix];
        }

        return imageMap.building[buildingType + '-' + userColor + castlePostfix];
    }

    render(): Node {
        const view = this;

        return (
            <div className={style.wrapper}>
                <Canvas className={style.image} width={48} height={48} src={view.getImageSrc()}/>
                {view.renderArmorData()}
                <div className={style.frame}/>
            </div>
        );
    }
}
