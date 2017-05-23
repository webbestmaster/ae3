import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class Render extends BaseModel {
    constructor() {
        super();
        const app = new PIXI.Application(800, 600, {backgroundColor: 0x000000});

        document.getElementById('canvas-holder').appendChild(app.view);
    }
}

const loader = new PIXI.loaders.Loader();
loader.add('assets/terrain.json');

loader.load((loader, resources) => {
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.
    const texture = PIXI.Texture.fromFrame("angle-road-1.png");
});

export {Render};
