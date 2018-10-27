// @flow

/* eslint consistent-this: ["error", "building"] */

import * as PIXI from 'pixi.js';
import type {BuildingAttrTypeType, BuildingType, MapUserType} from '../../../../maps/type';
import {getUserColor} from '../helper';
import {mapGuide} from '../../../../maps/map-guide';
import {imageMap} from '../../image/image-map';
import {isNotString, isString} from '../../../../lib/is/is';

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
        const building = this;
        const {buildingData} = JSON.parse(JSON.stringify(buildingConstructor));

        if (isNotString(buildingData.userId) || isNotString(buildingData.id)) {
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

    // eslint-disable-next-line complexity
    initializeBuildingSprite() {
        const building = this;
        const {attr, gameAttr} = building;
        const {square} = mapGuide.size;

        if (attr.type === mapGuide.building.castle.name) {
            gameAttr.container.position.set(attr.x * square, attr.y * square - square);
        } else {
            gameAttr.container.position.set(attr.x * square, attr.y * square);
        }

        if ([mapGuide.building.castle.name, mapGuide.building.farm.name].includes(attr.type)) {
            let color = 'gray';

            if (isString(attr.userId)) {
                const userColor = getUserColor(attr.userId, gameAttr.userList);

                if (isString(userColor)) {
                    color = userColor;
                }
            }

            gameAttr.sprite.building = PIXI.Sprite.fromImage(imageMap.building[attr.type + '-' + color]);

            gameAttr.container.addChild(gameAttr.sprite.building);
        }

        if (
            [mapGuide.building.well.name, mapGuide.building.temple.name, mapGuide.building.farmDestroyed.name].includes(
                attr.type
            )
        ) {
            gameAttr.sprite.building = PIXI.Sprite.fromImage(
                imageMap.building[mapGuide.building[attr.type].spriteName]
            );

            gameAttr.container.addChild(gameAttr.sprite.building);
        }
    }

    defineEventListeners() {
        const building = this;
        const {attr, gameAttr} = building;
        const {square} = mapGuide.size;

        gameAttr.container.interactive = true;
        gameAttr.container.buttonMode = true;

        gameAttr.container.hitArea =
            attr.type === mapGuide.building.castle.name ?
                new PIXI.Rectangle(0, square, square, square) :
                new PIXI.Rectangle(0, 0, square, square);
    }

    setType(type: BuildingAttrTypeType) {
        const building = this;
        const {attr, gameAttr} = building;

        attr.type = type;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    setUserId(userId: string) {
        const building = this;
        const {attr, gameAttr} = building;

        attr.userId = userId;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    getUserId(): string {
        const building = this;
        const {attr} = building;

        return isString(attr.userId) ? attr.userId : 'no-user-id';
    }

    setAttr(newAttr: BuildingAttrType) {
        const building = this;
        const {gameAttr} = building;

        building.attr = newAttr;

        gameAttr.container.removeChild(gameAttr.sprite.building);

        building.initializeBuildingSprite();
    }

    setNoManAttr() {
        const building = this;
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
