import {Archer} from './units/archer';
import {Catapult} from './units/catapult';
import {Crystal} from './units/crystal';
import {DemonLord} from './units/demon-lord';
import {DireWolf} from './units/dire-wolf';
import {Dragon} from './units/dragon';
import {Elemental} from './units/elemental';
import {Galamar} from './units/galamar';
import {Golem} from './units/golem';
import {Saeth} from './units/saeth';
import {Skeleton} from './units/skeleton';
import {Soldier} from './units/soldier';
import {Sorceress} from './units/sorceress';
import {Valadorn} from './units/valadorn';
import {Wisp} from './units/wisp';

const unitMap = {
    soldier: Soldier,
    archer: Archer,
    elemental: Elemental,
    sorceress: Sorceress,
    wisp: Wisp,
    'dire-wolf': DireWolf,
    golem: Golem,
    catapult: Catapult,
    dragon: Dragon,
    skeleton: Skeleton,
    crystal: Crystal,
    galamar: Galamar,
    'demon-lord': DemonLord,
    valadorn: Valadorn,
    saeth: Saeth
};

export function createUnit(data) {
    return new unitMap[data.type](data);
}
