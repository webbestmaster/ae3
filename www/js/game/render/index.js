import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class Render extends BaseModel {
    constructor() {
        super();
        const app = new PIXI.Application(800, 600, {backgroundColor: 0x000000});

        document.getElementById('canvas-holder').appendChild(app.view);
    }
}

export {Render};
