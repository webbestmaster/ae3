// @flow

/* global window */

import * as PIXI from 'pixi.js';

type InitializeConfigType = {|
    width: number,
    height: number,
    view: HTMLElement
|};

const sprite = require('./image.png');

export default class Game {
    app: PIXI.Application;
    constructor() {

    }

    initialize(setting: InitializeConfigType) {
        const game = this; // eslint-disable-line consistent-this

        const app = new PIXI.Application(setting.width, setting.height, {
            view: setting.view,
            clearBeforeRender: false,
            sharedTicker: true,
            sharedLoader: true,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });

        game.app = app;

        app.stage.addChild(PIXI.Sprite.fromImage(sprite));
    }

    setCanvasSize(width: number, height: number) {

    }
}
