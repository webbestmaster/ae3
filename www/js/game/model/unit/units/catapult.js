import {Unit} from './base-unit';

class Catapult extends Unit {
    move(x, y) {
        return super.move(x, y).then(() => this.set('isFinished', true));
    }

    attackSquareFilter(x, y) {
        const unit = this;
        const unitX = unit.get('x');
        const unitY = unit.get('y');

        return !(x === unitX && Math.abs(unitY - y) === 1 || y === unitY && Math.abs(unitX - x) === 1);
    }

    getAvailableAttack() {
        return super.getAvailableAttack().filter(([x, y]) => this.attackSquareFilter(x, y));
    }

    getAvailableDestroyBuilding() {
        return super.getAvailableDestroyBuilding().filter(([x, y]) => this.attackSquareFilter(x, y));
    }
}

export {Catapult};
