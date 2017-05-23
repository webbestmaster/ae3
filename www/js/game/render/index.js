import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class Render extends BaseModel {
    constructor() {
        super();

        const render = this;
        const app = new PIXI.Application(800, 600, {backgroundColor: 0x000000});

        document.getElementById('canvas-holder').appendChild(app.view);

        const boxContainer = new PIXI.Container();

        const layers = ['landscape'];

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

        app.stage.addChild(boxContainer);

        render.set({app});
    }

    addChild(layerName, sprite) {
        this.get(layerName).addChild(sprite);
    }

    drawLandscape(landscape) {
        const render = this;
        // const container = render.get('landscape');
        const squareSize = render.get('squareSize');

        // draw main landscape
        landscape.forEach((line, y) => line.forEach((square, x) => {
            const sprite = PIXI.Sprite.fromFrame(square + '.png');
            sprite.x = x * squareSize;
            sprite.y = y * squareSize;
            render.addChild('landscape', sprite);
        }));

        // draw angles
        landscape.forEach((line, y) => line.forEach((square, x) => {


        }));

        // cacheAsBitmap: true after render - http://pixijs.download/release/docs/PIXI.Container.html

    }

}



const loader = new PIXI.loaders.Loader();
loader.add('assets/terrain.json');

loader.load((loader, resources) => {
    console.log('loaded');
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.
    // const texture = PIXI.Texture.fromFrame("angle-road-1.png");
});

export {Render};
