import BaseModel from './../../../core/base-model';
import {getPath} from './../../path-master';
import api from './../../../user/api';
import {TimelineLite, Power0} from 'gsap';
import {getPath as getStarPath} from 'a-star-finder';
import {getMyPublicId} from './../../../lib/me';
const PIXI = require('pixi.js');
const renderConfig = require('./../../render/config.json');
const unitGuide = require('./unit-guide.json');

const attr = {
    type: 'type',
    animatedSprite: 'animatedSprite',
    // render: 'render',
    color: 'color',
    userOrder: 'userOrder',
    game: 'game',
    ownerPublicId: 'ownerPublicId',
    team: 'team'
};

class Unit extends BaseModel {
    constructor(data) {
        super(data);

        const unit = this;
        const {type, x, y, color} = data;

        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame(type + '-' + color + '-' + ii))
        );

        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        // animatedSprite.x = x * squareSize;
        // animatedSprite.y = y * squareSize;

        unit.set(attr.animatedSprite, animatedSprite);

        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();

        render.addChild('units', animatedSprite);

        animatedSprite.interactive = true;
        animatedSprite.buttonMode = true;

        animatedSprite.on('pointertap', () => unit.onClick());

        unit.putTo(x, y);
    }

    move(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'move',
                    steps: unit.getMovePath(x, y)
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());

        game.clearMoveSquares();
    }

    getMovePath(endX, endY) {
        const unit = this;
        const game = unit.get(attr.game);
        const availablePath = unit.getAvailablePath();
        const landscape = game.get('model-landscape');
        const filledMap = landscape.getFilledMap();
        const start = [unit.get('x'), unit.get('y')];

        availablePath.forEach(([x, y]) => {
            filledMap[y][x] = '';
        });

        return getStarPath(filledMap, start, [endX, endY]);
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
                tl = tl.to(xy, 0.5, {x, y, ease: Power0.easeNone});
            });
        });
    }

    putTo(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const render = game.get('render');
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

        if (getMyPublicId() === unit.get(attr.ownerPublicId)) {
            unit.addMoveSquares(availablePath);
            unit.addAttackSquares();
            return;
        }

        console.warn('you can not touch this unit');
    }

    addAttackSquares() {
        console.warn('implement me!!!')
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
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        unit.clearMoveSquares();

        availablePath.forEach(arrXY => {
            game.addMoveSquare(
                arrXY[0],
                arrXY[1],
                {
                    events: {
                        pointertap: () => unit.move(arrXY[0], arrXY[1])
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

    isEnemy(unit) {
        return this.get(attr.team) !== unit.get(attr.team);
    }

    isSameTeam(unit) {
        return this.get(attr.team) === unit.get(attr.team);
    }

    isSameOwner(unit) {
        return this.get(attr.ownerPublicId) === unit.get(attr.ownerPublicId);
    }
}

export {Unit};
