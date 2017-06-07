import BaseModel from './../../core/base-model';
import {getMyPublicId, getMyOrder} from './../../lib/me';
import {store} from './../../';
import {setShopVisible} from './../shop/action';
const PIXI = require('pixi.js');

const attr = {
    game: 'game',
    type: 'type',
    color: 'color',
    sprite: 'sprite',
    ownerPublicId: 'ownerPublicId'
};

class Building extends BaseModel {
    constructor(props) {
        super(props);

        const building = this;
        const render = building.get(attr.game).get('render');
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
        const game = model.get(attr.game);

        if (myPublicId !== model.get(attr.ownerPublicId)) {
            return;
        }

        // TODO: check for available squares for shop
        game.set('shop', model);

        store.dispatch(setShopVisible(true));
    }
}

export {Building};
