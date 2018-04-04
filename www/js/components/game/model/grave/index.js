// @flow

import * as PIXI from 'pixi.js';
import type {GraveType} from '../../../../maps/type';
import type {ServerUserType} from '../../../../module/server-api';
import {getUserColor} from './../helper';
import mapGuide from './../../../../maps/map-guide';
import imageMap from './../../image/image-map';

type GraveAttrType = GraveType;

type GraveGameAttrType = {|
    container: PIXI.Container,
    sprite: {|
        grave: PIXI.Sprite
    |}
|};

type GraveConstructorType = {|
    graveData: GraveType
|};

export default class Grave {
    attr: GraveAttrType;
    gameAttr: GraveGameAttrType;

    constructor(graveConstructor: GraveConstructorType) {
        const grave = this; // eslint-disable-line consistent-this
        const {graveData} = JSON.parse(JSON.stringify(graveConstructor));

        grave.attr = graveData;

        grave.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                grave: new PIXI.Sprite()
            }
        };

        grave.initializeGraveSprite();
    }

    initializeGraveSprite() { // eslint-disable-line complexity
        const grave = this; // eslint-disable-line consistent-this
        const {attr, gameAttr} = grave;
        const {square} = mapGuide.size;

        gameAttr.container.position.set(attr.x * square, attr.y * square);

        gameAttr.sprite.grave = PIXI.Sprite.fromImage(imageMap.other.grave);

        gameAttr.container.addChild(gameAttr.sprite.grave);
    }

    setRemoveCountdown(removeCountdown: number) {
        const grave = this; // eslint-disable-line consistent-this
        const {attr} = grave;

        attr.removeCountdown = removeCountdown;
    }
}
