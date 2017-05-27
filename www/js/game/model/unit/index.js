import BaseModel from './../../../core/base-model';
import {getPath} from './../../path-master';
const PIXI = require('pixi.js');
const renderConfig = require('./../../render/config.json');

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

        animatedSprite.x = x * squareSize;
        animatedSprite.y = y * squareSize;

        unit.set(attr.animatedSprite, animatedSprite);

        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();

        render.addChild('units', animatedSprite);

        animatedSprite.interactive = true;
        animatedSprite.buttonMode = true;

        animatedSprite.on('click', () => unit.onClick());
    }

    move(x, y) { // need list of coordinates to move as A*

    }

    attack(x, y) {

    }

    onClick() {
        // get available actions
            // get available path
        const unit = this;
        const availablePath = unit.getAvailablePath();
        console.log(availablePath);
    }

    getAvailablePath() {
        const unit = this;
        const game = unit.get(attr.game);
        const landscape = game.get('model-landscape');
        const pathMap = landscape.getPathMap();
        const units = game.get('model-units');

        units.forEach(unit => unit);

        debugger


    }
}

export {Unit};
