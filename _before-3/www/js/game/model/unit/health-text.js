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

export default class HealthText extends BaseModel {
    constructor(data) {
        super(data);

        const model = this;
        const unit = model.get(attr.unit);

        model.listenTo(unit, 'health', (newValue, oldValue) => model.redrawHealth(newValue, oldValue), model);

        const squareSize = unit.get('game').get('render').get('squareSize');

        // text
        const textStyle = new PIXI.TextStyle(style);
        const sprite = new PIXI.Text('', textStyle);

        sprite.x = 0;
        sprite.y = squareSize;

        sprite.anchor.set(0, 1);

        model.set(attr.sprite, sprite);

        unit.trigger('health');
    }

    redrawHealth(newValue, oldValue) {
        const model = this;
        const sprite = model.get(attr.sprite);

        sprite.text = newValue;
    }
}
