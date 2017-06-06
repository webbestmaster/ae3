import BaseModel from './../../core/base-model';
import {getMyPublicId} from './../../lib/me';
const PIXI = require('pixi.js');

const attr = {
    type: 'type',
    color: 'color',
    sprite: 'sprite',
    render: 'render',
    ownerPublicId: 'ownerPublicId'
};

class Building extends BaseModel {
    constructor(props) {
        super(props);

        const building = this;
        const render = building.get(attr.render);
        const squareSize = render.get('squareSize');

        const {type, color, x, y} = props;

        const sprite = color ?
            PIXI.Sprite.fromFrame(type + '-' + color) :
            PIXI.Sprite.fromFrame(type);

        sprite.anchor.y = 1;
        sprite.x = x * squareSize;
        sprite.y = (y + 1) * squareSize;

        building.set(attr.sprite, sprite);

        render.addChild('buildings', sprite);

        building.startListening();
    }

    startListening() {
        const model = this;
        const sprite = model.get(attr.sprite);

        sprite.interactive = true;
        sprite.buttonMode = true;

        if (model.get(attr.type) === 'castle') {
            sprite.on('pointertap', () => model.onClick());
        }
    }

    onClick() {
        const model = this;
        const myPublicId = getMyPublicId();

        if (myPublicId !== model.get(attr.ownerPublicId)) {
            return;
        }

        // check for available squares (2, 4, 5, 6, 8) for new units - create as separate function

        debugger
    }
}

export {Building};
