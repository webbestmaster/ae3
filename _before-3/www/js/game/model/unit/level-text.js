import BaseModel from './../../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    unit: 'unit',
    sprite: 'sprite'
};

const style = {
    fontFamily: '"Lucida Console", Monaco, monospace',
    fontSize: 9,
    lineHeight: 9,
    fill: '#cccc00', // gradient
    stroke: '#000',
    strokeThickness: 3
};

export default class LevelText extends BaseModel {
    constructor(data) {
        super(data);

        const model = this;
        const unit = model.get(attr.unit);

        model.listenTo(unit, 'level', (newValue, oldValue) => model.redrawLevel(newValue, oldValue), model);

        const squareSize = unit.get('game').get('render').get('squareSize');

        // text
        const textStyle = new PIXI.TextStyle(style);
        const sprite = new PIXI.Text('', textStyle);

        sprite.x = 0;
        sprite.y = 0;

        sprite.anchor.set(0, 0);

        model.set(attr.sprite, sprite);

        unit.trigger('level');
    }

    redrawLevel(newValue, oldValue) {
        const model = this;
        const sprite = model.get(attr.sprite);

        sprite.text = newValue;
    }
}
