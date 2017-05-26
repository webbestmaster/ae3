import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

class SelectMark extends BaseModel {
    constructor(data) {
        super(data);

        const mark = this;
        const {x = 0, y = 0} = data;

        const animatedSprite = new PIXI.extras.AnimatedSprite(
            [0, 1].map(ii => PIXI.Texture.fromFrame('select-mark-' + ii))
        );
    }
}

export {SelectMark};
