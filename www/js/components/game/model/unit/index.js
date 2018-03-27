// @flow

import * as PIXI from 'pixi.js';
import type {UnitType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import imageMap from './../../image/image-map';
import Building from '../building';
import {getPath} from './path-master';
import type {AvailablePathMapType} from './path-master';
import type {PathType, PointType} from './../../../../lib/a-star-finder';
import {tweenList} from './../../../../lib/tween';

export type UnitActionMoveType = {|
    type: 'move',
    from: {
        x: number,
        y: number
    },
    to: {
        x: number,
        y: number
    },
    id: string,
    container: PIXI.Container
|};

export type UnitActionType = UnitActionMoveType;

export type UnitActionsMapType = Array<Array<Array<UnitActionType>>>;

type UnitAttrType = {|
    x: number,
    y: number,
    type: string,
    userId: string | null,
    id: string,
    container: PIXI.Container,
    sprite: {
        unit: PIXI.Sprite
    },
    userList: Array<ServerUserType>,
    event: {
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    }
|};

type UnitConstructorType = {|
    unitData: UnitType,
    userList: Array<ServerUserType>,
    event: {
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    }
|};

type GameDataType = {|
    +userList: Array<ServerUserType>;
    +buildingList: Array<Building>;
    +unitList: Array<Unit>; // eslint-disable-line no-use-before-define
    +pathMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    };
    +armorMap: {
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>
    };
    +emptyActionMap: Array<Array<[]>>
|};

export default class Unit {
    attr: UnitAttrType;

    constructor(unitConstructor: UnitConstructorType) {
        const unit = this; // eslint-disable-line consistent-this
        const {unitData} = unitConstructor;

        if (typeof unitData.userId !== 'string' || typeof unitData.id !== 'string') {
            console.warn('---> unitData has NO .userId or/and .id', unitData);
        }

        unit.attr = {
            x: unitData.x,
            y: unitData.y,
            type: unitData.type,
            userId: typeof unitData.userId === 'string' ? unitData.userId : null,
            id: typeof unitData.id === 'string' ? unitData.id : 'no-unit-id-' + Math.random(),
            container: new PIXI.Container(),
            sprite: {
                unit: new PIXI.Sprite()
            },
            userList: unitConstructor.userList,
            event: {
                click: unitConstructor.event.click
            }
        };

        unit.initializeUnitSprite();
        unit.bindUnitEventListeners();
    }

    initializeUnitSprite() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {square} = mapGuide.size;

        let color = 'gray';

        attr.container.position.set(attr.x * square, attr.y * square);

        if (typeof attr.userId === 'string') {
            const userColor = getUserColor(attr.userId, attr.userList);

            if (typeof userColor === 'string') {
                color = userColor;
            }
        }

        // $FlowFixMe
        attr.sprite.unit = new PIXI.extras.AnimatedSprite([
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-0']),
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-1'])
        ]);

        attr.sprite.unit.animationSpeed = 0.08;

        attr.sprite.unit.play();
        // attr.sprite.unit = PIXI.Sprite.fromImage(imageMap.unit[attr.type + '-' + color + '-0']);

        attr.container.addChild(attr.sprite.unit);
    }

    getActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this; // eslint-disable-line consistent-this
        const availablePath = unit.getAvailablePath(gameData);
        const actionMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));

        availablePath.forEach((cell: [number, number]) => {
            actionMap[cell[1]][cell[0]].push({
                id: unit.attr.id,
                type: 'move',
                from: {
                    x: unit.attr.x,
                    y: unit.attr.y
                },
                to: {
                    x: cell[0],
                    y: cell[1]
                },
                container: new PIXI.Container()
            });
        });

        return actionMap;
    }

    getUnitCoordinates(gameData: GameDataType): Array<[number, number]> {
        const {unitList} = gameData;

        return unitList.map((unit: Unit): [number, number] => [unit.attr.x, unit.attr.y]);
    }

    getAvailablePath(gameData: GameDataType): AvailablePathMapType {
        const unit = this; // eslint-disable-line consistent-this

        return getPath(unit.attr.x, unit.attr.y, 4, gameData.pathMap.walk, unit.getUnitCoordinates(gameData));
    }

    bindUnitEventListeners() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {square} = mapGuide.size;

        const unitContainer = unit.attr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        unitContainer.on('click', () => {
            unit.attr.event.click(unit);
        });
    }

    move(x: number, y: number, movePath: PathType): Promise<void> {
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {square} = mapGuide.size;

        attr.x = x;
        attr.y = y;

        attr.container.position.set(x * square, y * square);

        return tweenList(movePath, 100, (pathPoint: PointType) => {
            attr.container.position.set(pathPoint[0] * square, pathPoint[1] * square);
        })
            .then(() => {
            });
    }
}
