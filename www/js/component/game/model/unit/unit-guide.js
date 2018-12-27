// @flow

import type {LangKeyType} from '../../../locale/translation/type';
import {mapGuide} from '../../../../maps/map-guide';

export type UnitTypeCommonType =
    | 'soldier'
    | 'archer'
    | 'elemental'
    | 'sorceress'
    | 'wisp'
    | 'dire-wolf'
    | 'golem'
    | 'catapult'
    | 'dragon'
    | 'skeleton';

export type UnitTypeCommanderType = 'galamar' | 'valadorn' | 'demon-lord' | 'saeth';

export type UnitTypeExtraType = 'crystal' | 'saeth-heavens-fury';

export type UnitTypeAllType = UnitTypeCommonType | UnitTypeCommanderType | UnitTypeExtraType;

export type UnitMoveType = 'walk' | 'fly' | 'flow';

export type UnitDataType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number,
    |},
    +armor: number,
    +move: number,
    +langKey: {|
        +name: LangKeyType,
        +description: LangKeyType,
    |},
    +cost: number,

    +auraRange?: number,

    +moveType: UnitMoveType,

    +canFixBuilding?: boolean,
    +occupyBuildingList?: Array<string>,
    +bonusAtkAgainstSkeleton: number,
    +bonusAtkAgainstFly: number,
    +poisonAttack?: number,

    +destroyBuildingList?: Array<string>,

    +raiseSkeletonRange?: number,
    +canBeBuy?: boolean,
    +withoutGrave?: boolean,
    +isCommander?: boolean,
    +isDisabledAfterMove?: boolean,
|};

type UnitGuideDataType = {+[key: UnitTypeAllType]: UnitDataType};

export const unitGuideData: UnitGuideDataType = {
    soldier: {
        // attack: {
        //     min: 150,
        //     max: 155,
        //     range: 4
        // },
        // original data
        attack: {
            min: 50,
            max: 55,
            range: 1,
        },
        armor: 5,
        move: 4,
        langKey: {
            name: 'UNIT__SOLDIER__NAME',
            description: 'UNIT__SOLDIER__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 150,

        canFixBuilding: true,
        occupyBuildingList: [mapGuide.building.farm.name],
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    archer: {
        attack: {
            min: 50,
            max: 55,
            range: 2,
        },
        armor: 5,
        move: 4,
        langKey: {
            name: 'UNIT__ARCHER__NAME',
            description: 'UNIT__ARCHER__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 250,

        bonusAtkAgainstFly: 30,
        moveType: 'walk',
        bonusAtkAgainstSkeleton: 0,
    },
    elemental: {
        attack: {
            min: 50,
            max: 55,
            range: 1,
        },
        armor: 10,
        move: 4,
        langKey: {
            name: 'UNIT__ELEMENTAL__NAME',
            description: 'UNIT__ELEMENTAL__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 300,

        moveType: 'flow',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    sorceress: {
        attack: {
            min: 40,
            max: 45,
            range: 1,
        },
        armor: 5,
        move: 4,
        langKey: {
            name: 'UNIT__SORCERESS__NAME',
            description: 'UNIT__SORCERESS__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 400,

        raiseSkeletonRange: 1,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    wisp: {
        attack: {
            min: 35,
            max: 40,
            range: 1,
        },
        armor: 10,
        move: 4,
        langKey: {
            name: 'UNIT__WISP__NAME',
            description: 'UNIT__WISP__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 500,

        auraRange: 2,
        bonusAtkAgainstSkeleton: 30,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
    },
    'dire-wolf': {
        attack: {
            min: 60,
            max: 65,
            range: 1,
        },
        armor: 15,
        move: 5,
        langKey: {
            name: 'UNIT__DIRE_WOLF__NAME',
            description: 'UNIT__DIRE_WOLF__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 600,

        poisonAttack: 3,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    golem: {
        attack: {
            min: 60,
            max: 70,
            range: 1,
        },
        armor: 30,
        move: 4,
        langKey: {
            name: 'UNIT__GOLEM__NAME',
            description: 'UNIT__GOLEM__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 600,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    catapult: {
        attack: {
            min: 50,
            max: 70,
            range: 4,
        },
        armor: 10,
        move: 3,
        langKey: {
            name: 'UNIT__CATAPULT__NAME',
            description: 'UNIT__CATAPULT__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 700,

        isDisabledAfterMove: true,

        destroyBuildingList: [mapGuide.building.farm.name],
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    dragon: {
        attack: {
            min: 70,
            max: 80,
            range: 1,
        },
        armor: 25,
        move: 6,
        langKey: {
            name: 'UNIT__DRAGON__NAME',
            description: 'UNIT__DRAGON__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 1000,

        moveType: 'fly',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    skeleton: {
        attack: {
            min: 40,
            max: 50,
            range: 1,
        },
        armor: 2,
        move: 4,
        langKey: {
            name: 'UNIT__SKELETON__NAME',
            description: 'UNIT__SKELETON__DESCRIPTION',
        },
        cost: 0,

        withoutGrave: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    crystal: {
        attack: {
            min: 0,
            max: 0,
            range: 0,
        },
        armor: 15,
        move: 3,
        langKey: {
            name: 'UNIT__CRYSTAL__NAME',
            description: 'UNIT__CRYSTAL__DESCRIPTION',
        },
        cost: 0,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    galamar: {
        attack: {
            min: 55,
            max: 65,
            range: 1,
        },
        armor: 20,
        move: 4,
        langKey: {
            name: 'UNIT__GALAMAR__NAME',
            description: 'UNIT__GALAMAR__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [mapGuide.building.farm.name, mapGuide.building.castle.name],
        isCommander: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    valadorn: {
        attack: {
            min: 55,
            max: 65,
            range: 1,
        },
        armor: 20,
        move: 4,
        langKey: {
            name: 'UNIT__VALADORN__NAME',
            description: 'UNIT__VALADORN__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [mapGuide.building.farm.name, mapGuide.building.castle.name],
        isCommander: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    'demon-lord': {
        attack: {
            min: 55,
            max: 65,
            range: 1,
        },
        armor: 20,
        move: 4,
        langKey: {
            name: 'UNIT__DEMON_LORD__NAME',
            description: 'UNIT__DEMON_LORD__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [mapGuide.building.farm.name, mapGuide.building.castle.name],
        isCommander: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    saeth: {
        attack: {
            min: 55,
            max: 65,
            range: 1,
        },
        armor: 20,
        move: 4,
        langKey: {
            name: 'UNIT__SAETH__NAME',
            description: 'UNIT__SAETH__DESCRIPTION',
        },
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [mapGuide.building.farm.name, mapGuide.building.castle.name],
        isCommander: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
    'saeth-heavens-fury': {
        attack: {
            min: 55,
            max: 65,
            range: 15,
        },
        cost: 0,
        armor: 45,
        move: 0,
        langKey: {
            name: 'UNIT__SAETH_HEAVENS_FURY__NAME',
            description: 'UNIT__SAETH_HEAVENS_FURY__DESCRIPTION',
        },

        withoutGrave: true,
        moveType: 'walk',
        bonusAtkAgainstFly: 0,
        bonusAtkAgainstSkeleton: 0,
    },
};

/*
    other: {
        grave: {
            liveTime: 3
        },
        aura: {
            wisp: {
                addAttack: 10
            }
        },
        isPoisoned: {
            reduceAttack: 15,
            reduceArmor: 10,
            reduceMove: 1
        },
        waterElementalArmor: 3,
        levelBonus: {
            attack: 10,
            armor: 10
        }
    }
*/

export const defaultUnitData = {
    hitPoints: 100,
    poisonCountdown: 0,
    graveRemoveCountdown: 3,
    hasWispAura: false,
    render: {
        spriteAnimatedSpeed: 0.08,
    },
    level: {
        min: 0,
        max: 9,
        base: 100,
        additional: {
            attack: 5,
            armor: 5,
        },
    },
    experience: {
        destroyBuilding: 60,
    },
    move: {
        reduceByPoison: 1,
    },
    animation: {
        moveStep: 100,
        attack: 500,
        levelUp: 250,
        deltaHitPoints: 250,
    },
};

export const additionalUnitData = {
    wispAttackBonus: 15,
    poisonAttackReduce: 10,
    poisonArmorReduce: 10,
    additionalCommanderCost: 200,
};
