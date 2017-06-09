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

        const render = model.get(attr.game).get('render');
        const squareSize = render.get('squareSize');

        model.onChange(attr.type, type => {
            model.get(attr.sprite).texture = PIXI.Texture.fromFrame(type);
        });

        if (model.get(attr.type) === 'castle') {
            sprite.hitArea = new PIXI.Polygon([
                new PIXI.Point(0, -squareSize),
                new PIXI.Point(squareSize, -squareSize),
                new PIXI.Point(squareSize, 0),
                new PIXI.Point(0, 0)
            ]);
        }

        sprite.interactive = true;
        sprite.buttonMode = true;

        sprite.on('pointertap', () => model.onClick());
    }

    onClick() {
        const model = this;
        const myPublicId = getMyPublicId();
        const game = model.get(attr.game);

        game.clearAllSquares();

        const wrongUnit = game.findWrongUnit();

        if (wrongUnit) {
            wrongUnit.onClick();
            return;
        }

        if (model.get(attr.type) !== 'castle') {
            return;
        }

        if (myPublicId !== model.get(attr.ownerPublicId)) {
            return;
        }

        // check place for new unit
        if (!model.hasCrossSquares()) {
            return;
        }

        game.set('shop', model);
        store.dispatch(setShopVisible(true));
    }

    hasCrossSquares() {
        const model = this;
        const x = model.get('x');
        const y = model.get('y');
        const game = model.get(attr.game);
        const units = game.get('model-units');
        const landscape = game.get('model-landscape');

        return [
            [x, y - 1],
            [x - 1, y],
            [x, y],
            [x + 1, y],
            [x, y + 1]
        ].some(([squareX, squareY]) => {
            if (!landscape.hasSquare(squareX, squareY)) {
                return false;
            }

            return !game.getUnitByXY(squareX, squareY);
        });
    }
}

export {Building};
