import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');
const renderConfig = require('./../render/config.json');

const attr = {
    render: 'render',
    ui: 'ui',
    animatedSprite: 'animatedSprite'
};

class SelectMark extends BaseModel {
    constructor(data) {
        super(data);

        const mark = this;
        const render = mark.get(attr.render);
        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame('select-mark-' + ii))
        );

        animatedSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        animatedSprite.play();

        mark.set(attr.animatedSprite, animatedSprite);
        render.addChild(attr.ui, animatedSprite);

        mark.moveTo(data.x, data.y);
    }

    moveTo(x, y) {
        const mark = this;
        const animatedSprite = mark.get(attr.animatedSprite);
        const render = mark.get(attr.render);
        const squareSize = render.get('squareSize');

        animatedSprite.x = (x - 0.5) * squareSize;
        animatedSprite.y = (y - 0.5) * squareSize;
    }
}

export {SelectMark};
