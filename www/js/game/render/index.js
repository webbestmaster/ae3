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
            if (!isAnglesNeed(square)) {
                return;
            }

            const type = square.split('-')[0];
            let sprite = null;

            // put 2, 4, 6, 8 angle
            const square1 = landscape[y - 1] && landscape[y - 1][x - 1];
            const square2 = landscape[y - 1] && landscape[y - 1][x];
            const square3 = landscape[y - 1] && landscape[y - 1][x + 1];
            const square4 = landscape[y] && landscape[y][x - 1];
            const square5 = landscape[y] && landscape[y][x];
            const square6 = landscape[y] && landscape[y][x + 1];
            const square7 = landscape[y + 1] && landscape[y + 1][x - 1];
            const square8 = landscape[y + 1] && landscape[y + 1][x];
            const square9 = landscape[y + 1] && landscape[y + 1][x + 1];

            if (!isTheSameSquares(square, square2)) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-2.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }
            if (!isTheSameSquares(square, square4)) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-4.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }
            if (!isTheSameSquares(square, square6)) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-6.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }
            if (!isTheSameSquares(square, square8)) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-8.png');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            }

            console.log(x, y);

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

// helpers
function isAnglesNeed(square) {
    return square.indexOf('water-') === 0 || square.indexOf('road-') === 0;
}

function isTheSameSquares(square1, square2) {
    if (!square2) {
        return true;
    }

    return square1.split('-')[0] === square2.split('-')[0];
}
