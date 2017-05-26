import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    type: 'type',
    color: 'color',
    sprite: 'sprite',
    render: 'render'
};

class Building extends BaseModel {
    constructor(props) {
        super(props);

        const building = this;
        const render = building.get('render');
        const squareSize = render.get('squareSize');

        const {type, color} = props;

        const sprite = color ?
            PIXI.Sprite.fromFrame(type + '-' + color) :
            PIXI.Sprite.fromFrame(type);

        sprite.anchor.y = 1;
        sprite.x = props.x * squareSize;
        sprite.y = (props.y + 1) * squareSize;

        building.set(attr.sprite, sprite);

        render.addChild('buildings', sprite);
    }
}

export {Building};
