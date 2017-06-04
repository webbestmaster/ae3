import BaseModel from '../../../../core/base-model';
import {getPath} from '../../../path-master';
import api from '../../../../user/api';
import {TimelineLite, Power0, Power2} from 'gsap';
import {getPath as getStarPath} from 'a-star-finder';
import {getMyPublicId} from '../../../../lib/me';
import HealthText from '../health-text';
const PIXI = require('pixi.js');
const renderConfig = require('../../../render/config.json');
const unitGuide = require('../unit-guide.json');

const attr = {
    type: 'type',
    animatedSprite: 'animatedSprite',
    container: 'container',
    // render: 'render',
    color: 'color',
    // userOrder: 'userOrder',
    game: 'game',
    ownerPublicId: 'ownerPublicId',
    team: 'team',
    health: 'health',
    level: 'level',
    isActing: 'isActing',
    isMoved: 'isMoved',
    isFinished: 'isFinished',
    sprite: {
        health: 'sprite-health'
    }
};

const defaultValues = {
    level: 0,
    health: 100,
    isMoved: false,
    isActing: false
};

class Unit extends BaseModel {
    constructor(data) {
        super(Object.assign({}, data, defaultValues));

        const unit = this;
        const {x, y} = data;
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        // container
        const container = new PIXI.Container();

        render.addChild('units', container);
        unit.set(attr.container, container);


        unit.initializeMainSprite();
        unit.initializeHealth();

        unit.startListening();
        unit.putTo(x, y);
    }

    initializeMainSprite() {
        const unit = this;
        const container = unit.get(attr.container);

        const type = unit.get(attr.type);
        const color = unit.get(attr.color);

        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame(type + '-' + color + '-' + ii))
        );

        unit.set(attr.animatedSprite, animatedSprite);

        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();
        animatedSprite.interactive = true;
        animatedSprite.buttonMode = true;

        container.addChild(animatedSprite);
    }

    initializeHealth() {
        const unit = this;
        const container = unit.get(attr.container);
        const healthText = new HealthText({unit});

        unit.set(attr.sprite.health, healthText);

        container.addChild(healthText.get('sprite'));
    }

    startListening() {
        const unit = this;
        const game = unit.get(attr.game);
        const animatedSprite = unit.get(attr.animatedSprite);

        animatedSprite.on('pointertap', () => unit.onClick());

        unit.listenTo(game, 'currentUserPublicId', () => {
            unit.set({
                [attr.isMoved]: false,
                [attr.isFinished]: false
            });
        });

        unit.onChange(attr.isFinished, isFinished => {
            const tint = isFinished ? 0x888888 : 0xffffff;

            unit.get(attr.animatedSprite).tint = tint;
        });

        unit.onChange(attr.health, health => {
            if (health > 0) {
                return;
            }

            game.addGrave({
                x: unit.get('x'),
                y: unit.get('y'),
                count: unitGuide.other.grave.liveTime
            });
            unit.destroy();
        });
    }

    move(x, y) {
        const unit = this;
        const game = unit.get(attr.game);

        api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'move',
                    steps: unit.getMovePath(x, y)
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());

        game.clearAllSquares();
    }

    attack(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const enemy = game.getUnitByXY(x, y);

        api.post.room
            .pushTurn(null, {
                list: [
                    {
                        type: 'attack',
                        ...countBattle(unit, enemy)
                    }
                ]
            })
            .then(() => game.get('turnMaster').fetchTurns());

        game.clearAllSquares();
    }

    getAvailableDamage(health) {
        const unit = this;
        const type = unit.get(attr.type);
        const referenceData = unitGuide.type[type];
        const attackMin = referenceData.attack.min;
        const attackMax = referenceData.attack.max;
        const attackDelta = attackMax - attackMin;

        return Math.round(attackMin / defaultValues.health * health + Math.random() * attackDelta);
    }

    getAvailableDefence() {
        const unit = this;
        const type = unit.get(attr.type);
        const referenceData = unitGuide.type[type];

        return referenceData.defence;

        // check ground and building, self armor, under-wisp, under-poison, level
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

    animateAttack(enemy) {
        const unit = this;
        const render = unit.get(attr.game).get('render');
        const squareSize = render.get('squareSize');

        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3, 4, 5].map(ii => PIXI.Texture.fromFrame('simple-attack-animation-' + ii))
        );

        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();

        render.addChild('ui', animatedSprite);

        animatedSprite.x = unit.get('x') * squareSize;
        animatedSprite.y = unit.get('y') * squareSize;

        return new Promise(resolve => {
            const tl = new TimelineLite({
                onComplete: () => {
                    render.removeChild('ui', animatedSprite);
                    tl.kill();
                    resolve();
                }
            });

            tl.to(animatedSprite, 0.5, {
                x: enemy.get('x') * squareSize,
                y: enemy.get('y') * squareSize,
                ease: Power2.easeOut
            });
        });
    }

    putTo(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        unit.set({x, y});

        const container = unit.get(attr.container);

        container.x = squareSize * x;
        container.y = squareSize * y;
    }

    onClick() {
        const unit = this;

        if (unit.get(attr.isActing)) {
            return;
        }

        const game = unit.get(attr.game);
        const currentUserPublicId = game.get('currentUserPublicId');
        const availablePath = unit.getAvailablePath();
        const availableAttack = unit.getAvailableAttack();

        if (unit.get(attr.isFinished) ||
            availablePath.length + availableAttack.length === 0) {
            unit.set(attr.isFinished, true);
            return;
        }

        if (getMyPublicId() === unit.get(attr.ownerPublicId)) {
            unit.addMoveSquares(availablePath);
            unit.addAttackSquares(availableAttack);
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

        if (unit.get(attr.isMoved)) {
            return [];
        }

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

    getAvailableAttack() {
        const unit = this;
        const game = unit.get(attr.game);
        const team = unit.get('team');
        const landscape = game.get('model-landscape');
        const filledMap = landscape.getAttackFilledMap();
        const units = game.get('model-units');

        return getPath(
            unit.get('x'),
            unit.get('y'),
            unitGuide.type[unit.get('type')].attackRange,
            filledMap
        ).filter(square => {
            const unitCandidate = game.getUnitByXY(square[0], square[1]);

            if (!unitCandidate) {
                return false;
            }

            return unitCandidate.get('team') !== team;
        });
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

    addAttackSquares(availableAttack) {
        const unit = this;
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        unit.clearAttackSquares();

        availableAttack.forEach(arrXY => {
            game.addAttackSquare(
                arrXY[0],
                arrXY[1],
                {
                    events: {
                        pointertap: () => unit.attack(arrXY[0], arrXY[1])
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

    clearAttackSquares() {
        const unit = this;
        const game = unit.get(attr.game);

        game.clearAttackSquares();
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

    destroy() {
        const unit = this;
        const game = unit.get(attr.game);

        game.removeUnit(unit);

        super.destroy();
    }
}

// helpers

function countBattle(attacker, defender) {
    let attackerAttack =
        attacker.getAvailableDamage(attacker.get(attr.health)) -
        defender.getAvailableDefence();

    attackerAttack = attackerAttack < 0 ? 0 : attackerAttack;

    const defenderHealth = defender.get(attr.health) - attackerAttack;

    // kill defender
    if (defenderHealth <= 0) {
        return {
            attacker: {
                attack: attackerAttack,
                x: attacker.get('x'),
                y: attacker.get('y')
            },
            defender: {
                health: 0,
                x: defender.get('x'),
                y: defender.get('y')
            }
        };
    }

    let defenderAttack =
        defender.getAvailableDamage(defenderHealth) -
        attacker.getAvailableDefence();

    defenderAttack = defenderAttack < 0 ? 0 : defenderAttack;

    const attackerHealth = attacker.get(attr.health) - defenderAttack;

    // kill attacker
    if (attackerHealth <= 0) {
        return {
            attacker: {
                attack: attackerAttack,
                health: 0,
                x: attacker.get('x'),
                y: attacker.get('y')
            },
            defender: {
                attack: defenderAttack,
                health: defenderHealth,
                x: defender.get('x'),
                y: defender.get('y')
            }
        };
    }

    return {
        attacker: {
            attack: attackerAttack,
            health: attackerHealth,
            x: attacker.get('x'),
            y: attacker.get('y')
        },
        defender: {
            attack: defenderAttack,
            health: defenderHealth,
            x: defender.get('x'),
            y: defender.get('y')
        }
    };
}


export {Unit, countBattle};
