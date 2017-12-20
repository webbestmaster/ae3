import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    game: 'game',
    sprite: 'sprite',
    count: 'count'
};

class Grave extends BaseModel {
    constructor(props) {
        super(props);

        const grave = this;
        const game = grave.get(attr.game);
        const render = game.get('render');
        const squareSize = render.get('squareSize');
        const sprite = PIXI.Sprite.fromFrame('grave');

        sprite.x = grave.get('x') * squareSize;
        sprite.y = grave.get('y') * squareSize;
        render.addChild('graves', sprite);

        grave.set(attr.sprite, sprite);

        grave.listenTo(game, 'currentUserPublicId', () => {
            grave.changeBy(attr.count, -1);

            if (grave.get(attr.count) === 0) {
                grave.destroy();
            }
        });
    }

    destroy() {
        const grave = this;
        const game = grave.get(attr.game);

        game.removeGrave(grave);
        super.destroy();
    }
}

export {Grave};
