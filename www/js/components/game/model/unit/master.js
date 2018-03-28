// @flow

import Unit from './index';
import UnitArcher from './archer';
import UnitCatapult from './catapult';
import UnitCrystal from './crystal';
import UnitDemonLord from './demon-lord';
import UnitDireWolf from './dire-wolf';
import UnitDragon from './dragon';
import UnitElemental from './elemental';
import UnitGalamar from './galamar';
import UnitGolem from './golem';
import UnitSaeth from './saeth';
import UnitSaethHeavenFury from './saeth-heavens-fury';
import UnitSkeleton from './skeleton';
import UnitSoldier from './soldier';
import UnitSorceress from './sorceress';
import UnitValadorn from './valadorn';
import UnitWisp from './wisp';

import type {UnitConstructorType} from './index';

export function createUnit(unitConstructor: UnitConstructorType): Unit { // eslint-disable-line complexity
    const type = unitConstructor.unitData.type;

    switch (type) {
        case 'archer':
            return new UnitArcher(unitConstructor);

        case 'catapult':
            return new UnitCatapult(unitConstructor);

        case 'crystal':
            return new UnitCrystal(unitConstructor);

        case 'demon-lord':
            return new UnitDemonLord(unitConstructor);

        case 'dire-wolf':
            return new UnitDireWolf(unitConstructor);

        case 'dragon':
            return new UnitDragon(unitConstructor);

        case 'elemental':
            return new UnitElemental(unitConstructor);

        case 'galamar':
            return new UnitGalamar(unitConstructor);

        case 'golem':
            return new UnitGolem(unitConstructor);

        case 'saeth':
            return new UnitSaeth(unitConstructor);

        case 'saeth-heavens-fury':
            return new UnitSaethHeavenFury(unitConstructor);

        case 'skeleton':
            return new UnitSkeleton(unitConstructor);

        case 'soldier':
            return new UnitSoldier(unitConstructor);

        case 'sorceress':
            return new UnitSorceress(unitConstructor);

        case 'valadorn':
            return new UnitValadorn(unitConstructor);

        case 'wisp':
            return new UnitWisp(unitConstructor);

        default:
            console.error('---> unsupported unit type:', type);
    }

    return new UnitSoldier(unitConstructor);
}

