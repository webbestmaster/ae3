import BaseModel from './../../../core/base-model';
import {getPath} from './../../path-master';
import api from './../../../user/api';
import {TimelineLite} from 'gsap';
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

        unit.putTo(x, y);
    }

    move(x, y) { // need list of coordinates to move as A*
        const unit = this;
        const game = unit.get(attr.game);
        const render = unit.get(attr.render);
        const squareSize = render.get('squareSize');

        api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'move',
                    steps: [[unit.get('x'), unit.get('y')], [1, 2], [3, 2], [x, y]]
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());

        /*
         unit.set({x, y});

         const animatedSprite = unit.get(attr.animatedSprite);

         animatedSprite.x = squareSize * x;
         animatedSprite.y = squareSize * y;
         */

        game.clearMoveSquares();
    }

    animateMove(steps) {
        const unit = this;
        const xy = {
            x: unit.get('x'),
            y: unit.get('y')
        };

        return new Promise(resolve => {
            let tl = new TimelineLite({
                onComplete: () => {
                    tl.kill();
                    resolve();
                },
                onUpdate: () => unit.putTo(xy.x, xy.y)
            });

            steps.forEach(([x, y]) => {
                tl = tl.to(xy, 1, {x, y});
            });
        });
    }

    putTo(x, y) {
        const unit = this;
        const render = unit.get(attr.render);
        const squareSize = render.get('squareSize');

        unit.set({x, y});

        const animatedSprite = unit.get(attr.animatedSprite);

        animatedSprite.x = squareSize * x;
        animatedSprite.y = squareSize * y;
    }

    attack(x, y) {

    }

    onClick() {
        // get available actions
        // get available path
        const unit = this;
        const game = unit.get(attr.game);
        const currentUserIndex = game.get('currentUserIndex');
        const availablePath = unit.getAvailablePath();

        if (game.getUserOrder() === unit.get(attr.userOrder) &&
            currentUserIndex === unit.get(attr.userOrder)) {
            unit.addMoveSquares(availablePath);
            return;
        }

        console.warn('you can not touch this unit');
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
            unitGuide.type[unit.get('type')].move,
            pathMap
        );
    }

    addMoveSquares(availablePath) {
        const unit = this;
        const render = unit.get(attr.render);
        const game = unit.get(attr.game);
        const squareSize = render.get('squareSize');

        unit.clearMoveSquares();

        availablePath.forEach(arrXY => {
            game.addMoveSquare(
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

    clearMoveSquares() {
        const unit = this;
        const game = unit.get(attr.game);

        game.clearMoveSquares();
    }
}

export {Unit};
