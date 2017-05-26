/* eslint-disable new-cap */
import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class Render extends BaseModel {
    constructor() {
        super();

        const render = this;
        const app = new PIXI.Application(480, 320, {backgroundColor: 0x000000});

        render.set({squareSize: 24});

        document.getElementById('canvas-holder').appendChild(app.view);

        const boxContainer = new PIXI.Container();

        const layers = ['landscape', 'buildings'];

        layers.forEach(layerName => {
            const container = new PIXI.Container();
            const squareSize = render.get('squareSize');

            container.width = squareSize * render.get('mapWidth');
            container.height = squareSize * render.get('mapHeight');

            container.x = 10;
            container.y = 10;

            render.set(layerName, container);
            boxContainer.addChild(container);
        });

        // to scale all - scale stage
        app.stage.addChild(boxContainer);

        render.set({app});
    }

    addChild(layerName, displayObject) {
        this.get(layerName).addChild(displayObject);
    }
}

// Scale mode for all textures, will retain pixelation
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const loader = new PIXI.loaders.Loader();

loader.add('assets/sprite.json');

loader.load(() => {
    console.log('loaded');
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.
    // const texture = PIXI.Texture.fromFrame("angle-road-1");
});

export {Render};
