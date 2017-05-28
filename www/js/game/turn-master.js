import BaseModel from './../core/base-model';
import api from './../user/api';
import Proc from './../lib/proc';
// import {Render} from './../render';
// import {Building} from './building';
// import {Landscape} from './landscape';
// import {Unit} from './unit/';
// import {SelectMark} from './ui';
const PIXI = require('pixi.js');

const attr = {
    hash: 'hash',
    turns: 'turns',
    proc: 'proc',
    onNewTurns: 'onNewTurns'
};

class TurnMaster extends BaseModel {
    constructor() {
        super();

        const model = this;

        model.set({
            [attr.hash]: 'all',
            [attr.turns]: [],
            [attr.proc]: null
        });

        // model.watchTurns();
    }

    watchTurns() {
        const model = this;
        const proc = new Proc(() => model.fetchTurns(), 1e3);

        model.set(attr.proc, proc);
    }

    fetchTurns() {
        const model = this;

        return api.get.room
            .getTurns({
                hash: model.get(attr.hash)
            })
            .then(({result}) => {
                const {turns} = result;
                const turnsLength = turns.length;

                if (turnsLength === 0) {
                    return;
                }

                model.set(attr.hash, turns[turnsLength - 1].hash);

                const onNewTurns = model.get(attr.onNewTurns);

                onNewTurns(turns.map(({turn}) => turn));
            });
    }

    destroy() {
        const model = this;

        model.get(attr.proc).destroy();
        super.destroy();
    }

    onNewTurns(callback) {
        this.set(attr.onNewTurns, callback);
    }
}

export {TurnMaster};
