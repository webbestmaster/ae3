import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    game: 'game',
    sprite: 'sprite',
    counter: 'counter'
};

class Grave extends BaseModel {
    constructor(props) {
        super(props);

        const sprite = PIXI.Sprite.fromFrame('grave');
    }
}

export {Grave};
