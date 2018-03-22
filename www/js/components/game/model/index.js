// @flow

/* global window */

import * as PIXI from 'pixi.js';
import type {MapType, LandscapeType} from '../../../maps/type';
import mapGuide from '../../../maps/map-guide';
import imageMap from './../image/image-map';

type InitializeConfigType = {|
    width: number,
    height: number,
    view: HTMLElement
|};

// const sprite = require('./image.png');

export default class Game {
    app: PIXI.Application;
    layer: {|
        landscape: PIXI.Container
    |}

    constructor() {
        const game = this; // eslint-disable-line consistent-this

        game.layer = {
            landscape: new PIXI.Container()
        };
    }

    initialize(setting: InitializeConfigType) {
        const game = this; // eslint-disable-line consistent-this

        PIXI.settings.SCALE_MODE = 1; // eslint-disable-line id-match

        const app = new PIXI.Application(setting.width, setting.height, {
            view: setting.view,
            clearBeforeRender: false,
            sharedTicker: true,
            sharedLoader: true,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });

        game.app = app;

        // app.stage.addChild(PIXI.Sprite.fromImage(sprite));

        app.stage.addChild(game.layer.landscape);

        app.stage.position.set(100, 100);

        app.stage.scale.set(2, 2);
    }

    setCanvasSize(width: number, height: number) {
        const game = this; // eslint-disable-line consistent-this

        game.app.renderer.resize(width, height);
    }

    drawLandscape(map: MapType) {
        const game = this; // eslint-disable-line consistent-this

        const {landscape} = game.layer;

        map.landscape.forEach((list: Array<LandscapeType>, tileY: number) => {
            list.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const sprite = PIXI.Sprite.fromImage(imageMap.landscape[landscapeItem]);

                sprite.position.set(tileX * mapGuide.size.square, tileY * mapGuide.size.square);

                landscape.addChild(sprite);
            });
        });
    }
}
