// @flow

import type {UnitConstructorType} from './unit';
import Unit from './unit';
import UnitArcher from './archer/archer';
import UnitCatapult from './catapult/catapult';
import UnitCrystal from './crystal/crystal';
import UnitDemonLord from './demon-lord/demon-lord';
import UnitDireWolf from './dire-wolf/dire-wolf';
import UnitDragon from './dragon/dragon';
import UnitElemental from './elemental/elemental';
import UnitGalamar from './galamar/galamar';
import UnitGolem from './golem/golem';
import UnitSaeth from './saeth/saeth';
import UnitSaethHeavenFury from './saeth-heavens-fury/saeth-heavens-fury';
import UnitSkeleton from './skeleton/skeleton';
import UnitSoldier from './soldier/soldier';
import UnitSorceress from './sorceress/sorceress';
import UnitValadorn from './valadorn/valadorn';
import UnitWisp from './wisp/wisp';

// eslint-disable-next-line complexity
export function createUnit(unitConstructor: UnitConstructorType): Unit {
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
