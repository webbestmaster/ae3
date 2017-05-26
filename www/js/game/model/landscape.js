import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    render: 'render',
    landscape: 'landscape'
};

class Landscape extends BaseModel {
    constructor(props) {
        super(props);

        const model = this;
        // const render = model.get(attr.render);
        // const squareSize = render.get('squareSize');

        model.drawLandscape(model.get(attr.landscape));
    }

    drawLandscape(landscape) {
        const model = this;
        const render = model.get(attr.render);
        const squareSize = render.get('squareSize');

        // draw main landscape
        landscape.forEach((line, y) => line.forEach((square, x) => {
            const sprite = PIXI.Sprite.fromFrame(square);

            sprite.x = x * squareSize;
            sprite.y = y * squareSize;
            render.addChild(attr.landscape, sprite);
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
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-2');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            if (!isTheSameSquare4) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-4');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            if (!isTheSameSquare6) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-6');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            if (!isTheSameSquare8) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-8');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            // 1st angle
            if (!isTheSameSquare1 &&
                isTheSameSquare2 && isTheSameSquare4) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-1-s');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            } else if (!isTheSameSquare2 && !isTheSameSquare4) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-1');
                sprite.x = x * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            // 3st angle
            if (!isTheSameSquare3 &&
                isTheSameSquare2 && isTheSameSquare6) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-3-s');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            } else if (!isTheSameSquare2 && !isTheSameSquare6) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-3');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = y * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            // 7st angle
            if (!isTheSameSquare7 &&
                isTheSameSquare4 && isTheSameSquare8) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-7-s');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild(attr.landscape, sprite);
            } else if (!isTheSameSquare4 && !isTheSameSquare8) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-7');
                sprite.x = x * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            // 9st angle
            if (!isTheSameSquare9 &&
                isTheSameSquare6 && isTheSameSquare8) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-9-s');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild(attr.landscape, sprite);
            } else if (!isTheSameSquare6 && !isTheSameSquare8) {
                sprite = PIXI.Sprite.fromFrame('angle-' + type + '-9');
                sprite.x = (x + 0.5) * squareSize;
                sprite.y = (y + 0.5) * squareSize;
                render.addChild(attr.landscape, sprite);
            }

            console.log(x, y);
        }));

        // TODO: cacheAsBitmap: true after render - http://pixijs.download/release/docs/PIXI.Container.html
    }
}

export {Landscape};

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
