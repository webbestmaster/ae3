// @flow
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

export type UnitTypeCommanderType =
    | 'galamar'
    | 'valadorn'
    | 'demon-lord'
    | 'saeth';

export type UnitTypeExtraType =
    | 'crystal'
    | 'saeth-heavens-fury';

export type UnitTypeAllType = UnitTypeCommonType | UnitTypeCommanderType | UnitTypeExtraType;

export type UnitGuideDataType = {|
    +attack: {|
        +min: number,
        +max: number,
        +range: number
    |},
    +armor: number,
    +move: number,
    +langKey: string,
    +cost: number,

    +auraRange?: number,

    +moveType?: string,

    +canFixBuilding?: boolean,
    +occupyBuildingList?: Array<string>,
    +bonusAtkAgainstSkeleton?: number,
    +bonusAtkAgainstFly?: number,
    +poisonAttack?: number,

    +destroyBuildingList?: Array<string>,

    +raiseSkeletonRange?: number,
    +canBeBuy?: boolean,
    +withoutGrave?: boolean,
    +isCommander?: boolean
|};

type GuideUnitDataType = { +[key: UnitTypeAllType]: UnitGuideDataType };


const unitData: GuideUnitDataType = {
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
            range: 1
        },
        armor: 5,
        move: 4,
        langKey: 'soldier',
        canBeBuy: true,
        cost: 150,

        canFixBuilding: true,
        occupyBuildingList: ['farm']
    },
    archer: {
        attack: {
            min: 50,
            max: 55,
            range: 2
        },
        armor: 5,
        move: 4,
        langKey: 'archer',
        canBeBuy: true,
        cost: 250,

        bonusAtkAgainstFly: 30
    },
    elemental: {
        attack: {
            min: 50,
            max: 55,
            range: 1
        },
        armor: 10,
        move: 4,
        langKey: 'elemental',
        canBeBuy: true,
        cost: 300,

        moveType: 'flow'
    },
    sorceress: {
        attack: {
            min: 40,
            max: 45,
            range: 1
        },
        armor: 5,
        move: 4,
        langKey: 'sorceress',
        canBeBuy: true,
        cost: 400,

        raiseSkeletonRange: 1
    },
    wisp: {
        attack: {
            min: 35,
            max: 40,
            range: 1
        },
        armor: 10,
        move: 4,
        langKey: 'wisp',
        canBeBuy: true,
        cost: 500,

        auraRange: 2,
        bonusAtkAgainstSkeleton: 30
    },
    'dire-wolf': {
        attack: {
            min: 60,
            max: 65,
            range: 1
        },
        armor: 15,
        move: 5,
        langKey: 'dire-wolf',
        canBeBuy: true,
        cost: 600,

        poisonAttack: 3
    },
    golem: {
        attack: {
            min: 60,
            max: 70,
            range: 1
        },
        armor: 30,
        move: 4,
        langKey: 'golem',
        canBeBuy: true,
        cost: 600
    },
    catapult: {
        attack: {
            min: 50,
            max: 70,
            range: 4
        },
        armor: 10,
        move: 3,
        langKey: 'catapult',
        canBeBuy: true,
        cost: 700,

        destroyBuildingList: ['farm']
    },
    dragon: {
        attack: {
            min: 70,
            max: 80,
            range: 1
        },
        armor: 25,
        move: 6,
        langKey: 'dragon',
        canBeBuy: true,
        cost: 1000,

        moveType: 'fly'
    },
    skeleton: {
        attack: {
            min: 40,
            max: 50,
            range: 1
        },
        armor: 2,
        move: 4,
        langKey: 'skeleton',
        cost: 0,

        withoutGrave: true
    },
    crystal: {
        attack: {
            min: 0,
            max: 0,
            range: 0
        },
        armor: 15,
        move: 3,
        langKey: 'crystal',
        cost: 0
    },
    galamar: {
        attack: {
            min: 55,
            max: 65,
            range: 1
        },
        armor: 20,
        move: 4,
        langKey: 'galamar',
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [
            'farm',
            'castle'
        ],
        isCommander: true
    },
    valadorn: {
        attack: {
            min: 55,
            max: 65,
            range: 1
        },
        armor: 20,
        move: 4,
        langKey: 'valadorn',
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [
            'farm',
            'castle'
        ],
        isCommander: true
    },
    'demon-lord': {
        attack: {
            min: 55,
            max: 65,
            range: 1
        },
        armor: 20,
        move: 4,
        langKey: 'demon-lord',
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [
            'farm',
            'castle'
        ],
        isCommander: true
    },
    saeth: {
        attack: {
            min: 55,
            max: 65,
            range: 1
        },
        armor: 20,
        move: 4,
        langKey: 'saeth',
        canBeBuy: true,
        cost: 200,

        withoutGrave: true,
        canFixBuilding: true,
        occupyBuildingList: [
            'farm',
            'castle'
        ],
        isCommander: true
    },
    'saeth-heavens-fury': {
        attack: {
            min: 55,
            max: 65,
            range: 15
        },
        cost: 0,
        armor: 45,
        move: 0,
        langKey: 'saeth',

        withoutGrave: true
    }
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
export default unitData;

const defaultUnitData = {
    hitPoints: 100,
    poisonCountdown: 0,
    graveRemoveCountdown: 3,
    hasWispAura: false,
    render: {
        spriteAnimatedSpeed: 0.08
    },
    level: {
        min: 0,
        max: 9,
        base: 45,
        scale: 1.05
    },
    armor: {
        perLevel: 5
    },
    animation: {
        moveStep: 100,
        attack: 500,
        levelUp: 250,
        deltaHitPoints: 250
    }
};

export {defaultUnitData};


const additionalUnitData = {
    wispAttackBonus: 15,
    poisonAttackReduce: 10,
    poisonArmorReduce: 10,
    additionalCommanderCost: 200
};

export {additionalUnitData};
