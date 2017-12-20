import {Unit} from './';
const PIXI = require('pixi.js');

const attr = {
    type: 'type',
    render: 'render',
    color: 'color',
    userOrder: 'userOrder'
};

class UnitSoldier extends Unit {
    constructor(data) {
        super(data);

        const unit = this;
    }
}

export {UnitSoldier};
