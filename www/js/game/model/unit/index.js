import BaseModel from './../../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    type: 'type',
    animatedSprite: 'animatedSprite',
    render: 'render',
    color: 'color',
    userOrder: 'userOrder'
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

        animatedSprite.animationSpeed = 0.1;
        animatedSprite.play();

        render.addChild('units', animatedSprite);

        animatedSprite.interactive = true;
        animatedSprite.buttonMode = true;

        animatedSprite.on('click', evt => {
            console.log('unit event')
        });


    }

    move(x, y) { // need list of coordinates to move as A*

    }

    attack(x, y) {

    }
}

export {Unit};
