import BaseModel from '../../../../core/base-model';
import {getPath} from '../../../path-master';
import api from '../../../../user/api';
import {TimelineLite, Power0, Power2} from 'gsap';
import {getPath as getStarPath} from 'a-star-finder';
import {getMyPublicId, getMyOrder} from '../../../../lib/me';
import HealthText from '../health-text';
import LevelText from '../level-text';
import {find} from 'lodash';
const PIXI = require('pixi.js');
const renderConfig = require('../../../render/config.json');
const unitGuide = require('../unit-guide.json');
const buildingGuide = require('../../building-guide.json');

const attr = {
    type: 'type',
    mainSprite: 'mainSprite',
    container: 'container',
    // render: 'render',
    color: 'color',
    // userOrder: 'userOrder',
    game: 'game',
    ownerPublicId: 'ownerPublicId',
    team: 'team',
    health: 'health',
    level: 'level',
    givenDamage: 'givenDamage',
    isAlive: 'isAlive',
    isActing: 'isActing',
    isMoved: 'isMoved',
    isFinished: 'isFinished',
    poisonedCounter: 'poisonedCounter',
    underAuraList: 'underAuraList',
    deathCounter: 'deathCounter',
    sprite: {
        level: 'sprite-level',
        health: 'sprite-health',
        poison: 'sprite-poison',
        aura: {
            wisp: 'sprite-aura-wisp'
        }
    }
};

const availableAuraList = ['wisp'];

const defaultValues = {
    givenDamage: 0,
    level: 0,
    health: 100,
    isMoved: false,
    isActing: false,
    poisonedCounter: 0,
    underAuraList: []
};

class Unit extends BaseModel {
    constructor(data) {
        super(Object.assign({}, defaultValues, data));

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
        unit.initializeLevel();
        unit.initializePoison();
        unit.initializeAuraWisp();
        unit.setPoisonVisual(unit.get(attr.poisonedCounter) > 0);

        unit.initializeAsCommander();

        unit.startListening();
        unit.putTo(x, y);
    }

    initializeAsCommander() {
        const unit = this;
        const type = unit.get(attr.type);
        const referenceData = unitGuide.type[type];

        if (!referenceData.isCommander) {
            return;
        }

        const game = unit.get(attr.game);
        const usersGameData = game.get('usersGameData');
        const publicId = unit.get(attr.ownerPublicId);
        const {commanders} = usersGameData[publicId];
        const commander = find(commanders, {type});

        if (commander) {
            commander[attr.isAlive] = true;
            commander[attr.deathCounter] += 1;
            unit.set(attr.givenDamage, commander[attr.givenDamage]);
            unit.checkLevel();
            return;
        }

        commanders.push({
            type,
            [attr.givenDamage]: 0,
            [attr.deathCounter]: 0,
            [attr.isAlive]: true
        });
    }

    checkLevel() {
        const levelList = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
        const unit = this;
        const givenDamage = unit.get(attr.givenDamage);

        levelList.every((levelValue, index) => {
            if (givenDamage >= levelValue) {
                return true;
            }

            unit.set(attr.level, index);
            return false;
        });
    }

    initializePoison() {
        const unit = this;
        const sprite = PIXI.Sprite.fromFrame('under-poison');
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        sprite.anchor.set(1, 0);
        sprite.x = squareSize;

        unit.set(attr.sprite.poison, sprite);
    }

    initializeAuraWisp() {
        const unit = this;
        const sprite = PIXI.Sprite.fromFrame('under-wisp-aura');
        const game = unit.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');

        sprite.anchor.set(0.5, 0);
        sprite.x = squareSize / 2;

        unit.set(attr.sprite.aura.wisp, sprite);
    }

    setPoisonVisual(isPoisoned) {
        const unit = this;
        const container = unit.get(attr.container);
        const poisonSprite = unit.get(attr.sprite.poison);

        if (isPoisoned) {
            container.addChild(poisonSprite);
            return;
        }

        container.removeChild(poisonSprite);
    }

    setWispAuraVisual(isUnderWispAura) {
        const unit = this;
        const container = unit.get(attr.container);
        const wispAuraSprite = unit.get(attr.sprite.aura.wisp);

        if (isUnderWispAura) {
            container.addChild(wispAuraSprite);
            return;
        }

        container.removeChild(wispAuraSprite);
    }

    initializeMainSprite() {
        const unit = this;
        const container = unit.get(attr.container);

        const type = unit.get(attr.type);
        const color = unit.get(attr.color);

        const mainSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame(type + '-' + color + '-' + ii))
        );

        unit.set(attr.mainSprite, mainSprite);

        mainSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        mainSprite.play();
        mainSprite.interactive = true;
        mainSprite.buttonMode = true;

        container.addChild(mainSprite);
    }

    initializeHealth() {
        const unit = this;
        const container = unit.get(attr.container);
        const healthText = new HealthText({unit});

        unit.set(attr.sprite.health, healthText);

        container.addChild(healthText.get('sprite'));
    }

    initializeLevel() {
        const unit = this;
        const container = unit.get(attr.container);
        const levelText = new LevelText({unit});

        unit.set(attr.sprite.level, levelText);

        container.addChild(levelText.get('sprite'));
    }

    startListening() {
        const unit = this;
        const game = unit.get(attr.game);
        const mainSprite = unit.get(attr.mainSprite);

        mainSprite.on('pointertap', () => unit.onClick());

        unit.listenTo(game, 'currentUserPublicId', () => {
            const poisonedCounter = Math.max(unit.get(attr.poisonedCounter) - 1, 0);

            unit.set({
                [attr.isMoved]: false,
                [attr.isFinished]: false,
                [attr.poisonedCounter]: poisonedCounter
            });

            unit.updateHealth();
        });

        unit.onChange(attr.isFinished, isFinished => {
            const tint = isFinished ? 0x888888 : 0xffffff;

            unit.get(attr.mainSprite).tint = tint;
        });

        unit.onChange(attr.health, health => {
            if (health > 0) {
                return;
            }

            const unitData = unitGuide.type[unit.get(attr.type)];
            const unitX = unit.get('x');
            const unitY = unit.get('y');

            if (!unitData.withoutGrave) {
                game.addGrave({
                    x: unitX,
                    y: unitY,
                    count: unitGuide.other.grave.liveTime
                });
            }

            if (unitData.isCommander) {
                const usersGameData = game.get('usersGameData');
                const publicId = unit.get(attr.ownerPublicId);
                const commanders = usersGameData[publicId].commanders;
                const commander = find(commanders, {type: unit.get(attr.type)});

                commander[attr.isAlive] = false;
            }

            unit.destroy();
        });

        unit.onChange(attr.poisonedCounter, newValue => unit.setPoisonVisual(newValue > 0));

        unit.listenTo(game, 'checkAura', () => unit.checkAura());
        unit.onChange(attr.underAuraList, currentAuraList => availableAuraList.forEach(auraType =>
            unit.drawAuraType(auraType, currentAuraList.indexOf(auraType) !== -1)));

        unit.onChange(attr.level, newLevel => console.log('NEW LEVEL!!!', unit, newLevel));
        unit.onChange(attr.givenDamage, givenDamage => {
            const type = unit.get(attr.type);
            const referenceData = unitGuide.type[type];

            if (!referenceData.isCommander) {
                return;
            }

            const usersGameData = game.get('usersGameData');
            const publicId = unit.get(attr.ownerPublicId);
            const commanders = usersGameData[publicId].commanders;
            const commander = find(commanders, {type});

            commander[attr.givenDamage] = givenDamage;
        });
    }

    updateHealth() {
        const unit = this;
        const ownerPublicId = unit.get(attr.ownerPublicId);
        const game = unit.get(attr.game);
        const currentUserPublicId = game.get('currentUserPublicId');

        if (currentUserPublicId !== ownerPublicId) {
            return;
        }

        const building = game.getBuildingByXY(unit.get('x'), unit.get('y'));

        if (!building) {
            return;
        }

        const buildingType = building.get('type');
        const buildingReferenceData = buildingGuide.type[buildingType];
        const buildingTeam = game.getTeamByPublicId(building.get('ownerPublicId'));

        if (['temple', 'well'].indexOf(buildingType) !== -1) {
            unit.addHealth(buildingReferenceData.healthAddition);
            return;
        }

        if (['farm', 'castle'].indexOf(buildingType) !== -1 && buildingTeam === unit.get(attr.team)) {
            unit.addHealth(buildingReferenceData.healthAddition);
            // return;
        }
    }

    addHealth(health) {
        const unit = this;
        const unitHealth = unit.get(attr.health);
        const additionalHealth = Math.min(health, defaultValues.health - unitHealth);

        unit.changeBy(attr.health, additionalHealth);
    }

    checkAura() {
        availableAuraList.forEach(unitAuraType => {
            const unit = this;
            const aura = unit.getAuraArea(unitAuraType, unit.get('team'));

            const unitX = unit.get('x');
            const unitY = unit.get('y');
            const hasAura = aura.some(([x, y]) => unitX === x && unitY === y);

            unit.setAura(unitAuraType, hasAura);
        });
    }

    getAuraArea(neededUnitType, team) {
        const unit = this;
        const unitType = unit.get(attr.type);

        // do not aura for own self
        if (unitType === neededUnitType) {
            return [];
        }

        const game = unit.get(attr.game);
        const neededUnits = game.get('model-units')
            .filter(unitItem => unitItem.get(attr.team) === team && unitItem.get(attr.type) === neededUnitType);
        const landscape = game.get('model-landscape');
        const attackFiledMap = landscape.getAttackFilledMap();
        const area = [];

        neededUnits.forEach(unitWithAura => Reflect.apply(area.push, area, getPath(
            unitWithAura.get('x'),
            unitWithAura.get('y'),
            unitGuide.type[neededUnitType].auraRange,
            attackFiledMap
        )));

        return area;
    }

    setAura(auraType, isExist) {
        const unit = this;
        const underAuraList = unit.get(attr.underAuraList);
        const index = underAuraList.indexOf(auraType);

        if (isExist) {
            if (index === -1) {
                underAuraList.push(auraType);
            }
        } else if (index !== -1) {
            underAuraList.splice(index, 1);
        }

        unit.set(attr.underAuraList, JSON.parse(JSON.stringify(underAuraList)));
    }

    drawAuraType(auraType, isExist) {
        const unit = this;

        if (auraType === 'wisp') {
            unit.setWispAuraVisual(isExist);
        }
    }

    move(x, y) {
        const unit = this;
        const game = unit.get(attr.game);

        game.clearAllSquares();

        return api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'move',
                    steps: unit.getMovePath(x, y)
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());
    }

    attack(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const enemy = game.getUnitByXY(x, y);

        game.clearAllSquares();

        return api.post.room
            .pushTurn(null, {
                list: [
                    {
                        type: 'attack',
                        ...countBattle(unit, enemy)
                    }
                ]
            })
            .then(() => game.get('turnMaster').fetchTurns());
    }

    destroyBuilding(x, y) {
        const unit = this;
        const game = unit.get(attr.game);

        game.clearAllSquares();

        return api.post.room
            .pushTurn(null, {
                list: [
                    {
                        type: 'destroy-building',
                        attacker: {
                            x: unit.get('x'),
                            y: unit.get('y')
                        },
                        building: {
                            x,
                            y
                        }
                    }
                ]
            })
            .then(() => game.get('turnMaster').fetchTurns());
    }

    getAvailableDamage(health, enemy) {
        const unit = this;
        const availableAttack = unit.getAvailableAttack();
        const type = unit.get(attr.type);
        const referenceData = unitGuide.type[type];
        const attackMin = referenceData.attack.min;
        const attackMax = referenceData.attack.max;
        const attackDelta = attackMax - attackMin;
        const attackBonus = unit.getAttackBonus(enemy);

        if (isUnitInSquares(enemy, availableAttack)) {
            return Math.round((attackBonus + attackMin) / defaultValues.health * health + Math.random() * attackDelta);
        }

        return null;
    }

    getAttackBonus(enemy) {
        const unit = this;
        const unitType = unit.get(attr.type);
        const enemyType = enemy.get(attr.type);
        const unitReferenceData = unitGuide.type[unitType];
        const enemyReferenceData = unitGuide.type[enemyType];
        let attackBonus = 0;

        if (unitReferenceData.bonusAtkAgainstFly && enemyReferenceData.moveType === 'fly') {
            attackBonus += unitReferenceData.bonusAtkAgainstFly;
        }

        if (unitReferenceData.bonusAtkAgainstSkeleton && enemyType === 'skeleton') {
            attackBonus += unitReferenceData.bonusAtkAgainstSkeleton;
        }

        return attackBonus;
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

        const mainSprite = new PIXI.extras.AnimatedSprite(
            [0, 1, 2, 3, 4, 5].map(ii => PIXI.Texture.fromFrame('simple-attack-animation-' + ii))
        );

        mainSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        mainSprite.play();

        render.addChild('ui', mainSprite);

        mainSprite.x = unit.get('x') * squareSize;
        mainSprite.y = unit.get('y') * squareSize;

        return new Promise(resolve => {
            const tl = new TimelineLite({
                onComplete: () => {
                    render.removeChild('ui', mainSprite);
                    tl.kill();
                    resolve();
                }
            });

            tl.to(mainSprite, 0.5, {
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
        const game = unit.get(attr.game);
        const currentUserPublicId = game.get('currentUserPublicId');
        const myPublicId = getMyPublicId();

        if (myPublicId !== currentUserPublicId) {
            return;
        }

        if (myPublicId !== unit.get(attr.ownerPublicId)) {
            return;
        }

        game.clearAllSquares();

        if (unit.get(attr.isActing)) {
            return;
        }

        const availablePath = unit.getAvailablePath();
        const availableAttack = unit.getAvailableAttack();
        const availableFixBuilding = unit.getAvailableFixBuilding();
        const availableOccupyBuilding = unit.getAvailableOccupyBuilding();
        const availableRaiseSkeleton = unit.getAvailableRaiseSkeleton();
        const availableDestroyBuilding = unit.getAvailableDestroyBuilding();

        const wrongUnit = game.findWrongUnit();

        if (wrongUnit) {
            if (wrongUnit === unit) {
                wrongUnit.addMoveSquares(availablePath);
            } else {
                wrongUnit.onClick();
            }
            return;
        }

        // show shop
        unit.addShopSquare();

        if (unit.get(attr.isFinished)) {
            return;
        }

        if (unit.get(attr.isMoved) &&
            availablePath.length +
            availableAttack.length +
            availableFixBuilding.length +
            availableOccupyBuilding.length +
            availableRaiseSkeleton.length +
            availableDestroyBuilding.length === 0) {
            unit.set(attr.isFinished, true);
            return;
        }

        unit.addFixBuildingSquares(availableFixBuilding);
        unit.addOccupyBuildingSquares(availableOccupyBuilding);
        unit.addRaiseSkeletonSquares(availableRaiseSkeleton);
        unit.addMoveSquares(availablePath);
        unit.addAttackSquares(availableAttack);
        unit.addDestroyBuildingSquares(availableDestroyBuilding);

        game.collectMultiActionSquares();

        // TODO: find squares with double action, for example - raise skeleton and move
        // and create square to select needed action
    }

    getAvailableFixBuilding() {
        const unit = this;
        const unitData = unitGuide.type[unit.get(attr.type)];
        const {canFixBuilding = false} = unitData;

        if (!canFixBuilding) {
            return [];
        }

        const game = unit.get(attr.game);
        const x = unit.get('x');
        const y = unit.get('y');
        const building = game.getBuildingByXY(x, y);

        if (!building) {
            return [];
        }

        if (building.get(attr.type) === 'farm-destroyed') {
            return [[x, y]];
        }

        return [];
    }

    getAvailableOccupyBuilding() {
        const unit = this;
        const unitData = unitGuide.type[unit.get(attr.type)];
        const {occupyBuildingList = null} = unitData;

        if (occupyBuildingList === null) {
            return [];
        }

        const game = unit.get(attr.game);
        const x = unit.get('x');
        const y = unit.get('y');
        const building = game.getBuildingByXY(x, y);

        if (!building) {
            return [];
        }

        if (occupyBuildingList.indexOf(building.get(attr.type)) === -1) {
            return [];
        }

        if (building.get(attr.ownerPublicId) === unit.get(attr.ownerPublicId)) {
            return [];
        }

        return [[x, y]];
    }

    getAvailableRaiseSkeleton() {
        const unit = this;
        const unitData = unitGuide.type[unit.get(attr.type)];
        const {raiseSkeletonRange = 0} = unitData;

        if (!raiseSkeletonRange) {
            return [];
        }

        const unitX = unit.get('x');
        const unitY = unit.get('y');
        const game = unit.get(attr.game);
        const landscape = game.get('model-landscape');
        const filledMap = landscape.getAttackFilledMap();

        return getPath(
            unitX,
            unitY,
            raiseSkeletonRange,
            filledMap
        )
            .filter(([squareX, squareY]) =>
                !game.getUnitByXY(squareX, squareY) &&
                game.getGraveByXY(squareX, squareY)
            );
    }

    getAvailableDestroyBuilding() {
        const unit = this;
        const unitData = unitGuide.type[unit.get(attr.type)];
        const {destroyBuildingList = []} = unitData;

        if (destroyBuildingList.length === 0) {
            return [];
        }

        const game = unit.get(attr.game);


        const unitX = unit.get('x');
        const unitY = unit.get('y');
        const team = unit.get('team');
        const landscape = game.get('model-landscape');
        const filledMap = landscape.getAttackFilledMap();

        const attackSquares = getPath(
            unitX,
            unitY,
            unitData.attackRange,
            filledMap
        );

        return attackSquares.filter(([x, y]) => {
            const building = game.getBuildingByXY(x, y);

            if (!building) {
                return false;
            }

            if (destroyBuildingList.indexOf(building.get('type')) === -1) {
                return false;
            }

            return building.get(attr.ownerPublicId) !== unit.get(attr.ownerPublicId);
        });
    }

    addShopSquare() {
        const unit = this;
        const game = unit.get(attr.game);
        const building = game.getBuildingByXY(unit.get('x'), unit.get('y'));

        // check building exist
        if (!building) {
            return;
        }

        // check this is castle
        if (building.get('type') !== 'castle') {
            return;
        }

        // check this is my building
        if (getMyPublicId() !== building.get(attr.ownerPublicId)) {
            return;
        }

        if (!building.hasCrossSquares()) {
            return;
        }

        game.addShopSquare(unit.get('x'), unit.get('y'), {
            events: {
                pointertap: () => building.onClick()
            }
        });
    }

    addFixBuildingSquares(list) {
        const unit = this;
        const game = unit.get(attr.game);

        list.forEach(([x, y]) => game.addFixBuildingSquare(x, y, {
            events: {
                pointertap: () => unit.fixBuilding(x, y)
            }
        }));
    }

    addOccupyBuildingSquares(list) {
        const unit = this;
        const game = unit.get(attr.game);

        list.forEach(([x, y]) => game.addOccupyBuildingSquare(x, y, {
            events: {
                pointertap: () => unit.occupyBuilding(x, y)
            }
        }));
    }

    addRaiseSkeletonSquares(list) {
        const unit = this;
        const game = unit.get(attr.game);

        list.forEach(([x, y]) => game.addRaiseSkeletonSquare(x, y, {
            events: {
                pointertap: () => unit.raiseSkeleton(x, y)
            }
        }));
    }

    fixBuilding(x, y) {
        const unit = this;
        const game = unit.get(attr.game);

        api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'fix-building',
                    x,
                    y
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());

        game.clearAllSquares();
    }

    occupyBuilding(x, y) {
        const unit = this;
        const game = unit.get(attr.game);

        api.post.room.pushTurn(null, {
            list: [
                {
                    type: 'occupy-building',
                    x,
                    y
                }
            ]
        }).then(() => game.get('turnMaster').fetchTurns());

        game.clearAllSquares();
    }

    raiseSkeleton(x, y) {
        const unit = this;
        const game = unit.get(attr.game);
        const userOrder = getMyOrder(game.get('users'));

        api.post.room
            .pushTurn(null, {
                list: [
                    {
                        type: 'raise-skeleton',
                        x,
                        y,
                        userOrder
                    }
                ]
            })
            .then(() => game.get('turnMaster').fetchTurns())
            .then(() => unit.set(attr.isFinished, true));

        game.clearAllSquares();
    }

    getAvailablePath() {
        const unit = this;
        const game = unit.get(attr.game);
        // const landscape = game.get('model-landscape');
        const pathMap = unit.getPathMap();
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
            unitGuide.type[unit.get(attr.type)].move,
            pathMap
        );
    }

    getPathMap() {
        const unit = this;
        const game = unit.get(attr.game);
        const landscape = game.get('model-landscape');
        const {moveType} = unitGuide.type[unit.get(attr.type)];

        if (moveType === 'fly') {
            return landscape.getFlyFilledMap();
        }

        if (moveType === 'flow') {
            return landscape.getFlowFilledMap();
        }

        return landscape.getPathMap();
    }

    getAvailableAttack() {
        const unit = this;
        const unitX = unit.get('x');
        const unitY = unit.get('y');
        const game = unit.get(attr.game);
        const team = unit.get('team');
        const landscape = game.get('model-landscape');
        const filledMap = landscape.getAttackFilledMap();
        const units = game.get('model-units');

        return getPath(
            unitX,
            unitY,
            unitGuide.type[unit.get(attr.type)].attackRange,
            filledMap
        ).filter(([squareX, squareY]) => {
            if (squareX === unitX && squareY === unitY) {
                return false;
            }

            const unitCandidate = game.getUnitByXY(squareX, squareY);

            if (!unitCandidate) {
                return false;
            }

            return unitCandidate.get('team') !== team;
        });
    }

    addMoveSquares(availablePath) {
        const unit = this;
        const game = unit.get(attr.game);
        // const render = game.get('render');
        // const squareSize = render.get('squareSize');

        // unit.clearMoveSquares();

        availablePath.forEach(([x, y]) => {
            game.addMoveSquare(
                x,
                y,
                {
                    events: {
                        pointertap: () => unit.move(x, y)
                    }
                }
            );
        });
    }

    addAttackSquares(availableAttack) {
        const unit = this;
        const game = unit.get(attr.game);
        // const render = game.get('render');
        // const squareSize = render.get('squareSize');

        // unit.clearAttackSquares();

        availableAttack.forEach(([x, y]) => {
            game.addAttackSquare(
                x,
                y,
                {
                    events: {
                        pointertap: () => unit.attack(x, y)
                    }
                }
            );
        });
    }

    addDestroyBuildingSquares(availableDestroyBuilding) {
        const unit = this;
        const game = unit.get(attr.game);
        // const render = game.get('render');
        // const squareSize = render.get('squareSize');

        availableDestroyBuilding.forEach(([x, y]) => {
            game.addDestroyBuildingSquare(
                x,
                y,
                {
                    events: {
                        pointertap: () => unit.destroyBuilding(x, y)
                    }
                }
            );
        });
    }

    /*
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
     */

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
    const attackerUnitData = unitGuide.type[attacker.get(attr.type)];
    const defenderUnitData = unitGuide.type[defender.get(attr.type)];

    const attackerResult = {
        attack: null,
        health: attacker.get(attr.health),
        x: attacker.get('x'),
        y: attacker.get('y'),
        poisonedCounter: attacker.get(attr.poisonedCounter)
    };

    const defenderResult = {
        attack: null,
        health: defender.get(attr.health),
        x: defender.get('x'),
        y: defender.get('y'),
        poisonedCounter: defender.get(attr.poisonedCounter)
    };

    const minAttack = 1;

    let attackerAttack =
        attacker.getAvailableDamage(attacker.get(attr.health), defender) -
        defender.getAvailableDefence();

    attackerAttack = Math.round(Math.max(attackerAttack, minAttack));

    const defenderHealth = defender.get(attr.health) - attackerAttack;

    // kill defender
    if (defenderHealth <= 0) {
        return {
            attacker: Object.assign(attackerResult, {
                attack: attackerAttack
            }),
            defender: Object.assign(defenderResult, {
                health: 0
            })
        };
    }

    let defenderAttack = defender.getAvailableDamage(defenderHealth, attacker);

    // null means attack to far for defender attack
    if (defenderAttack === null) {
        return {
            attacker: Object.assign(attackerResult, {
                attack: attackerAttack
            }),
            defender: Object.assign(defenderResult, {
                health: defenderHealth
            })
        };
    }

    defenderAttack -= attacker.getAvailableDefence();

    defenderAttack = Math.round(Math.max(defenderAttack, minAttack));

    const attackerHealth = attacker.get(attr.health) - defenderAttack;

    // kill attacker
    if (attackerHealth <= 0) {
        return {
            attacker: Object.assign(attackerResult, {
                attack: attackerAttack,
                health: 0
            }),
            defender: Object.assign(defenderResult, {
                attack: defenderAttack,
                health: defenderHealth,
                poisonedCounter: Math.max(defenderResult.poisonedCounter, attackerUnitData.poisonAttack || 0)
            })
        };
    }

    return {
        attacker: Object.assign(attackerResult, {
            attack: attackerAttack,
            health: attackerHealth,
            poisonedCounter: Math.max(attackerResult.poisonedCounter, defenderUnitData.poisonAttack || 0)
        }),
        defender: Object.assign(defenderResult, {
            attack: defenderAttack,
            health: defenderHealth,
            poisonedCounter: Math.max(defenderResult.poisonedCounter, attackerUnitData.poisonAttack || 0)
        })
    };
}

function isUnitInSquares(unit, squares) {
    const x = unit.get('x');
    const y = unit.get('y');

    return squares.some(square => square[0] === x && square[1] === y);
}

export {Unit, countBattle};
