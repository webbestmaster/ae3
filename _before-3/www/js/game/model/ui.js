import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');
const renderConfig = require('./../render/config.json');

const attr = {
    render: 'render',
    ui: 'ui',
    mainSprite: 'mainSprite'
};

class SelectMark extends BaseModel {
    constructor(data) {
        super(data);

        const mark = this;
        const render = mark.get(attr.render);
        const mainSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame('select-mark-' + ii))
        );

        mainSprite.animationSpeed = renderConfig.timing.shotAnimatedSpriteSpeed;
        mainSprite.play();

        mark.set(attr.mainSprite, mainSprite);
        render.addChild(attr.ui, mainSprite);

        mark.moveTo(data.x, data.y);
    }

    moveTo(x, y) {
        const mark = this;
        const mainSprite = mark.get(attr.mainSprite);
        const render = mark.get(attr.render);
        const squareSize = render.get('squareSize');

        mainSprite.x = (x - 0.5) * squareSize;
        mainSprite.y = (y - 0.5) * squareSize;
    }
}

export {SelectMark};
