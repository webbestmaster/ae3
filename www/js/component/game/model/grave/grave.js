// @flow

/* eslint consistent-this: ["error", "grave"] */

import * as PIXI from 'pixi.js';
import type {GraveType} from '../../../../maps/type';
import {mapGuide} from '../../../../maps/map-guide';
import {imageMap} from '../../image/image-map';

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

export class Grave {
    attr: GraveAttrType;
    gameAttr: GraveGameAttrType;

    constructor(graveConstructor: GraveConstructorType) {
        const grave = this;
        const {graveData} = JSON.parse(JSON.stringify(graveConstructor));

        grave.attr = graveData;

        grave.gameAttr = {
            container: new PIXI.Container(),
            sprite: {
                grave: new PIXI.Sprite(),
            },
        };

        grave.initializeGraveSprite();
    }

    // eslint-disable-next-line complexity
    initializeGraveSprite() {
        const grave = this;
        const {attr, gameAttr} = grave;
        const {square} = mapGuide.size;

        gameAttr.container.position.set(attr.x * square, attr.y * square);

        gameAttr.sprite.grave = PIXI.Sprite.fromImage(imageMap.other.grave);

        gameAttr.container.addChild(gameAttr.sprite.grave);
    }

    setRemoveCountdown(removeCountdown: number) {
        const grave = this;
        const {attr} = grave;

        attr.removeCountdown = removeCountdown;
    }

    destroy() {
        console.warn('implement grave destroy method for grave!!!!');
    }
}
