/* eslint-disable new-cap */
import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class Render extends BaseModel {
    constructor() {
        super();

        const render = this;
        const app = new PIXI.Application(800, 600, {backgroundColor: 0x000000});

        // Scale mode for all textures, will retain pixelation
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        document.getElementById('canvas-holder').appendChild(app.view);

        const boxContainer = new PIXI.Container();

        const layers = ['landscape', 'building'];

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

            // put angles
            const isTheSameSquare1 = isTheSameSquares(square, landscape[y - 1] && landscape[y - 1][x - 1]);
            const isTheSameSquare2 = isTheSameSquares(square, landscape[y - 1] && landscape[y - 1][x]);
            const isTheSameSquare3 = isTheSameSquares(square, landscape[y - 1] && landscape[y - 1][x + 1]);
            const isTheSameSquare4 = isTheSameSquares(square, landscape[y] && landscape[y][x - 1]);
            // const square5 = landscape[y] && landscape[y][x];
            const isTheSameSquare6 = isTheSameSquares(square, landscape[y] && landscape[y][x + 1]);
            const isTheSameSquare7 = isTheSameSquares(square, landscape[y + 1] && landscape[y + 1][x - 1]);
            const isTheSameSquare8 = isTheSameSquares(square, landscape[y + 1] && landscape[y + 1][x]);
            const isTheSameSquare9 = isTheSameSquares(square, landscape[y + 1] && landscape[y + 1][x + 1]);

            if (!isTheSameSquare2) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-2.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }

            if (!isTheSameSquare4) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-4.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }

            if (!isTheSameSquare6) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-6.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }

            if (!isTheSameSquare8) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-8.png');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            }

            // 1st angle
            if (!isTheSameSquare1 &&
                isTheSameSquare2 && isTheSameSquare4) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-1-s.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            } else if (!isTheSameSquare2 && !isTheSameSquare4) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-1.png');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }

            // 3st angle
            if (!isTheSameSquare3 &&
                isTheSameSquare2 && isTheSameSquare6) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-3-s.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            } else if (!isTheSameSquare2 && !isTheSameSquare6) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-3.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild('landscape', sprite);
            }

            // 7st angle
            if (!isTheSameSquare7 &&
                isTheSameSquare4 && isTheSameSquare8) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-7-s.png');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            } else if (!isTheSameSquare4 && !isTheSameSquare8) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-7.png');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            }

            // 9st angle
            if (!isTheSameSquare9 &&
                isTheSameSquare6 && isTheSameSquare8) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-9-s.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            } else if (!isTheSameSquare6 && !isTheSameSquare8) {
                sprite = new PIXI.Sprite.fromFrame('angle-' + type + '-9.png');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild('landscape', sprite);
            }

            console.log(x, y);
        }));

        // TODO: cacheAsBitmap: true after render - http://pixijs.download/release/docs/PIXI.Container.html
    }

    drawBuildings(buildings) {
        const render = this;
        const users = render.get('users');
        const squareSize = render.get('squareSize');

        buildings.forEach(building => {
            const user = users[building.userOrder];

            if (user) {
                const sprite = new PIXI.Sprite.fromFrame(building.type + '-' + user.color + '.png');

                sprite.x = building.x * squareSize;

                sprite.anchor.y = 1;
                sprite.y = (building.y + 1) * squareSize;

                render.addChild('building', sprite);
            } else {
                console.warn('add logic for no user\'s building');
            }
        });
    }
}


const loader = new PIXI.loaders.Loader();

loader.add('assets/terrain.json');

loader.load(() => {
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
