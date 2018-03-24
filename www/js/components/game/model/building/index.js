// @flow

import * as PIXI from 'pixi.js';
import type {BuildingType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import imageMap from './../../image/image-map';

type BuildingAttrType = {|
    x: number,
    y: number,
    type: string,
    userId: string | null,
    id: string,
    container: PIXI.Container,
    sprite: {
        building: PIXI.Sprite
    },
    userList: Array<ServerUserType>
|};

type BuildingConstructorType = {|
    buildingData: BuildingType,
    userList: Array<ServerUserType>
|};

export default class Building {
    attr: BuildingAttrType;

    constructor(buildingConstructor: BuildingConstructorType) {
        const building = this; // eslint-disable-line consistent-this
        const {buildingData} = buildingConstructor;

        if (typeof buildingData.userId !== 'string' || typeof buildingData.id !== 'string') {
            console.warn('---> buildingData has NO .userId or/and .id', buildingData);
        }

        building.attr = {
            x: buildingData.x,
            y: buildingData.y,
            type: buildingData.type,
            userId: typeof buildingData.userId === 'string' ? buildingData.userId : null,
            id: typeof buildingData.id === 'string' ? buildingData.id : 'no-bulding-id-' + Math.random(),
            container: new PIXI.Container(),
            sprite: {
                building: new PIXI.Sprite()
            },
            userList: buildingConstructor.userList
        };

        building.initializeBuildingSprite();
    }

    initializeBuildingSprite() { // eslint-disable-line complexity
        const building = this; // eslint-disable-line consistent-this
        const {attr} = building;
        const {square} = mapGuide.size;

        if (attr.type === 'castle') {
            attr.container.position.set(attr.x * square, attr.y * square - square);
        } else {
            attr.container.position.set(attr.x * square, attr.y * square);
        }

        if (['castle', 'farm'].includes(attr.type)) {
            let color = 'gray';

            if (typeof attr.userId === 'string') {
                const userColor = getUserColor(attr.userId, attr.userList);

                if (typeof userColor === 'string') {
                    color = userColor;
                }
            }

            attr.sprite.building = PIXI.Sprite.fromImage(imageMap.building[attr.type + '-' + color]);

            attr.container.addChild(attr.sprite.building);
        }

        if (['well', 'temple', 'farm-destroyed'].includes(attr.type)) {
            attr.sprite.building = PIXI.Sprite.fromImage(imageMap.building[attr.type]);

            attr.container.addChild(attr.sprite.building);
        }
    }
}
