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

export type UnitActionType = UnitActionMoveType; // | UnitActionMoveType;

export type UnitActionsMapType = Array<Array<Array<UnitActionType>>>;

type UnitAttrType = UnitType;

type UnitGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        unit: PIXI.extras.AnimatedSprite
    |},
    userList: Array<ServerUserType>,
    event: {|
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    |}
|};

export type UnitConstructorType = {|
    unitData: UnitType,
    userList: Array<ServerUserType>,
    event: {|
        click: (unit: Unit) => void // eslint-disable-line no-use-before-define
    |}
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
    gameAttr: UnitGameAttrType;

    constructor(unitConstructor: UnitConstructorType): Unit {
        const unit = this; // eslint-disable-line consistent-this

        unit.initialize(unitConstructor);

        return unit;
    }

    initialize(unitConstructor: UnitConstructorType) {
        const unit = this; // eslint-disable-line consistent-this
        const {unitData} = unitConstructor;

        if (typeof unitData.userId !== 'string' || typeof unitData.id !== 'string') {
            console.warn('---> unitData has NO .userId or/and .id', unitData);
        }

        unit.attr = JSON.parse(JSON.stringify(unitData));

        unit.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                unit: new PIXI.extras.AnimatedSprite([
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-0']),
                    PIXI.Texture.fromImage(imageMap.unit[unit.attr.type + '-gray-1'])
                ])
            },
            userList: JSON.parse(JSON.stringify(unitConstructor.userList)),
            event: {
                click: unitConstructor.event.click
            }
        };

        unit.initializeUnitSprite();
        unit.bindUnitEventListeners();
    }

    initializeUnitSprite() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        let color = 'gray';

        gameAttr.container.position.set(attr.x * square, attr.y * square);

        if (typeof attr.userId === 'string') {
            const userColor = getUserColor(attr.userId, gameAttr.userList);

            if (typeof userColor === 'string') {
                color = userColor;
            }
        }

        gameAttr.sprite.unit = new PIXI.extras.AnimatedSprite([
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-0']),
            PIXI.Texture.fromImage(imageMap.unit[attr.type + '-' + color + '-1'])
        ]);

        gameAttr.sprite.unit.animationSpeed = 0.08;

        gameAttr.sprite.unit.play();
        // attr.sprite.unit = PIXI.Sprite.fromImage(imageMap.unit[attr.type + '-' + color + '-0']);

        gameAttr.container.addChild(gameAttr.sprite.unit);
    }

    getActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this; // eslint-disable-line consistent-this
        const availablePath = unit.getAvailablePath(gameData);
        const actionMap: UnitActionsMapType = JSON.parse(JSON.stringify(gameData.emptyActionMap));


        availablePath.forEach((cell: [number, number]) => {
            if (typeof unit.attr.id !== 'string') {
                return;
            }
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
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        const unitContainer = unit.gameAttr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        unitContainer.on('click', () => {
            console.log('click on unit', unit);
            unit.gameAttr.event.click(unit);
        });
    }

    move(x: number, y: number, movePath: PathType): Promise<void> {
        const unit = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = unit;
        const {square} = mapGuide.size;

        attr.x = x;
        attr.y = y;

        // gameAttr.container.position.set(x * square, y * square);

        return tweenList(movePath, 100, (pathPoint: PointType) => {
            gameAttr.container.position.set(pathPoint[0] * square, pathPoint[1] * square);
        })
            .then(() => {
            });
    }
}
