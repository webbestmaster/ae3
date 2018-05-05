// @flow

import * as PIXI from 'pixi.js';
import type {BuildingAttrTypeType, BuildingType, MapUserType} from './../../../../maps/type';
// import type {ServerUserType} from './../../../../module/server-api';
import {getUserColor} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import imageMap from './../../image/image-map';
import type {UserIdType} from '../../../../maps/type';

type BuildingAttrType = BuildingType;

type BuildingGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        building: PIXI.Sprite
    |},
    userList: Array<MapUserType>
|};

type BuildingConstructorType = {|
    buildingData: BuildingType,
    userList: Array<MapUserType>
|};

export default class Building {
    attr: BuildingAttrType;
    gameAttr: BuildingGameAttrType;

    constructor(buildingConstructor: BuildingConstructorType) {
        const building = this; // eslint-disable-line consistent-this
        const {buildingData} = JSON.parse(JSON.stringify(buildingConstructor));

        if (typeof buildingData.userId !== 'string' || typeof buildingData.id !== 'string') {
            console.warn('---> buildingData has NO .userId or/and .id', buildingData);
        }

        building.attr = buildingData;

        building.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                building: new PIXI.Sprite()
            },
            userList: JSON.parse(JSON.stringify(buildingConstructor.userList))
        };

        building.initializeBuildingSprite();
        building.defineEventListeners();
    }

    initializeBuildingSprite() { // eslint-disable-line complexity
        const building = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = building;
        const {square} = mapGuide.size;

        if (attr.type === 'castle') {
            gameAttr.container.position.set(attr.x * square, attr.y * square - square);
        } else {
            gameAttr.container.position.set(attr.x * square, attr.y * square);
        }

        if (['castle', 'farm'].includes(attr.type)) {
            let color = 'gray';

            if (typeof attr.userId === 'string') {
                const userColor = getUserColor(attr.userId, gameAttr.userList);

                if (typeof userColor === 'string') {
                    color = userColor;
                }
            }

            gameAttr.sprite.building = PIXI.Sprite.fromImage(imageMap.building[attr.type + '-' + color]);

            gameAttr.container.addChild(gameAttr.sprite.building);
        }

        if (['well', 'temple', 'farm-destroyed'].includes(attr.type)) {
            gameAttr.sprite.building = PIXI.Sprite.fromImage(imageMap.building[attr.type]);

            gameAttr.container.addChild(gameAttr.sprite.building);
        }
    }

    defineEventListeners() {
        const building = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = building;
        const {square} = mapGuide.size;

        if (attr.type !== 'castle') {
            return;
        }

        gameAttr.container.interactive = true;
        gameAttr.container.buttonMode = true;
        gameAttr.container.hitArea = new PIXI.Rectangle(0, square, square, square);
    }

    setType(type: BuildingAttrTypeType) {
        const building = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = building;

        attr.type = type;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    setUserId(userId: string) {
        const building = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = building;

        attr.userId = userId;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    getUserId(): string {
        const building = this; // eslint-disable-line consistent-this
        const {attr} = building;

        return typeof attr.userId === 'string' ? attr.userId : 'no-user-id';
    }

    setAttr(newAttr: BuildingAttrType) {
        const building = this; // eslint-disable-line consistent-this
        const {gameAttr} = building;

        building.attr = newAttr;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    setNoManAttr() {
        const building = this; // eslint-disable-line consistent-this
        const {gameAttr} = building;

        building.attr = {
            type: building.attr.type,
            x: building.attr.x,
            y: building.attr.y,
            id: building.attr.id
        };

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }
}
