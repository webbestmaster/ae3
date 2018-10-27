// @flow

import type {UnitConstructorType} from './unit';
import {Unit} from './unit';
import {Archer} from './archer/archer';
import {Catapult} from './catapult/catapult';
import {Crystal} from './crystal/crystal';
import {DemonLord} from './demon-lord/demon-lord';
import {DireWolf} from './dire-wolf/dire-wolf';
import {Dragon} from './dragon/dragon';
import {Elemental} from './elemental/elemental';
import {Galamar} from './galamar/galamar';
import {Golem} from './golem/golem';
import {Saeth} from './saeth/saeth';
import {SaethHeavensFury} from './saeth-heavens-fury/saeth-heavens-fury';
import {Skeleton} from './skeleton/skeleton';
import {Soldier} from './soldier/soldier';
import {Sorceress} from './sorceress/sorceress';
import {Valadorn} from './valadorn/valadorn';
import {Wisp} from './wisp/wisp';

// eslint-disable-next-line complexity
export function createUnit(unitConstructor: UnitConstructorType): Unit {
    const type = unitConstructor.unitData.type;

    switch (type) {
        case 'archer':
            return new Archer(unitConstructor);

        case 'catapult':
            return new Catapult(unitConstructor);

        case 'crystal':
            return new Crystal(unitConstructor);

        case 'demon-lord':
            return new DemonLord(unitConstructor);

        case 'dire-wolf':
            return new DireWolf(unitConstructor);

        case 'dragon':
            return new Dragon(unitConstructor);

        case 'elemental':
            return new Elemental(unitConstructor);

        case 'galamar':
            return new Galamar(unitConstructor);

        case 'golem':
            return new Golem(unitConstructor);

        case 'saeth':
            return new Saeth(unitConstructor);

        case 'saeth-heavens-fury':
            return new SaethHeavensFury(unitConstructor);

        case 'skeleton':
            return new Skeleton(unitConstructor);

        case 'soldier':
            return new Soldier(unitConstructor);

        case 'sorceress':
            return new Sorceress(unitConstructor);

        case 'valadorn':
            return new Valadorn(unitConstructor);

        case 'wisp':
            return new Wisp(unitConstructor);

        default:
            console.error('---> unsupported unit type:', type);
    }

    return new Soldier(unitConstructor);
}
