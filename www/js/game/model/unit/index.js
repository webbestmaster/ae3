import BaseModel from './../../../core/base-model';
import {getPath} from './../../path-master';
const PIXI = require('pixi.js');
const renderConfig = require('./../../render/config.json');
const unitGuide = require('./unit-guide.json');

const attr = {
    type: 'type',
    animatedSprite: 'animatedSprite',
    render: 'render',
    color: 'color',
    userOrder: 'userOrder',
    game: 'game'
};

class Unit extends BaseModel {
    constructor(data) {
        super(data);

        const unit = this;
        const {type, x, y, color} = data;

        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame(type + '-' + color + '-' + ii))
        );

        const render = unit.get(attr.render);
        const squareSize = render.get('squareSize');

        // animatedSprite.x = x * squareSize;
        // animatedSprite.y = y * squareSize;

        unit.set(attr.animatedSprite, animatedSprite);


        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();

        render.addChild('units', animatedSprite);

        animatedSprite.interactive = true;
        animatedSprite.buttonMode = true;

        animatedSprite.on('click', () => unit.onClick());

        unit.move(x, y);
    }

    move(x, y) { // need list of coordinates to move as A*
        const unit = this;
        const game = unit.get(attr.game);
        const render = unit.get(attr.render);
        const squareSize = render.get('squareSize');

        unit.set({x, y});

        const animatedSprite = unit.get(attr.animatedSprite);

        animatedSprite.x = squareSize * x;
        animatedSprite.y = squareSize * y;

        game.clearMovieSquares();
    }

    attack(x, y) {

    }

    onClick() {
        // get available actions
        // get available path
        const unit = this;
        const availablePath = unit.getAvailablePath();

        unit.addMovieSquares(availablePath);
    }

    getAvailablePath() {
        const unit = this;
        const game = unit.get(attr.game);
        const landscape = game.get('model-landscape');
        const pathMap = landscape.getPathMap();
        const units = game.get('model-units');

        units.forEach(unitItem => {
            const x = unitItem.get('x');
            const y = unitItem.get('y');

            pathMap[y][x] = 100; // 100 is just big number
        });

        return getPath(
            unit.get('x'),
            unit.get('y'),
            unitGuide.type[unit.get('type')].movie,
            pathMap
        );
    }

    addMovieSquares(availablePath) {
        const unit = this;
        const render = unit.get(attr.render);
        const game = unit.get(attr.game);
        const squareSize = render.get('squareSize');

        unit.clearMovieSquares();

        availablePath.forEach(arrXY => {
            game.addMovieSquare(
                arrXY[0],
                arrXY[1],
                {
                    events: {
                        click: () => unit.move(arrXY[0], arrXY[1])
                    }
                }
            );
        });
    }

    clearMovieSquares() {
        const unit = this;
        const game = unit.get(attr.game);

        game.clearMovieSquares();
    }
}

export {Unit};
