import BaseModel from './../../core/base-model';
const PIXI = require('pixi.js');

const attr = {
    type: 'type',
    color: 'color',
    sprite: 'sprite',
    render: 'render'
};

/*

 drawBuildings(buildings) {
 const render = this;
 const users = render.get('users');
 const squareSize = render.get('squareSize');

 buildings.forEach(building => {
 const user = users[building.userOrder];

 if (user) {
 const sprite = new PIXI.Sprite.fromFrame(building.type + '-' + user.color + '.png');

 sprite.x = building.x * squareSize;

 sprite.anchor.y = 1;
 sprite.y = (building.y + 1) * squareSize;

 render.addChild('building', sprite);
 } else {
 console.warn('add logic for no user\'s building');
 }
 });
 }
 */


class Building extends BaseModel {
    constructor(props) {
        super(props);

        const building = this;
        const render = building.get('render');
        const squareSize = render.get('squareSize');

        const {type, color} = props;

        const sprite = color ?
            PIXI.Sprite.fromFrame(type + '-' + color + '.png') :
            PIXI.Sprite.fromFrame(type + '.png');

        sprite.anchor.y = 1;
        sprite.x = props.x * squareSize;
        sprite.y = (props.y + 1) * squareSize;

        building.set(attr.sprite, sprite);

        render.addChild('building', sprite);
    }
}

export {Building};
