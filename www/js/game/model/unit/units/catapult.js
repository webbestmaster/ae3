import {Unit} from './base-unit';

class Catapult extends Unit {
    move(x, y) {
        return super.move(x, y).then(() => this.set('isFinished', true));
    }
}

export {Catapult};
