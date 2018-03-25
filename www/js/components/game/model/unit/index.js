// @flow

import * as PIXI from 'pixi.js';
import type {UnitType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import imageMap from './../../image/image-map';

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
    userList: Array<ServerUserType>
|};

type UnitConstructorType = {|
    unitData: UnitType,
    userList: Array<ServerUserType>
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
            userList: unitConstructor.userList
        };

        unit.initializeUnitSprite();
        // unit.bindUnitEventListeners();
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

/*
    bindUnitEventListeners() { // eslint-disable-line complexity
        const unit = this; // eslint-disable-line consistent-this
        const {attr} = unit;
        const {square} = mapGuide.size;

        const unitContainer = unit.attr.container;

        unitContainer.interactive = true;
        unitContainer.buttonMode = true;

        unitContainer.on('click', () => {
            unit.attr.onClick()
        });
    }
*/
}
