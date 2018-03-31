// @flow

const unitData = {
    soldier: {
        attack: {
            min: 50,
            max: 55,
            range: 1
        },
        armor: 5,
        move: 4,
        langKey: 'soldier',
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
        cost: 600,

        poisonAttack: 2
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

        withoutGrave: true,
        canNotBeBuy: true
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
        cost: 0,

        canNotBeBuy: true
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
        armor: 45,
        move: 0,
        langKey: 'saeth',

        canNotBeBuy: true,
        withoutGrave: true
    }

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
};

export default unitData;

const defaultUnitData = {
    hitPoints: 100,
    poisonCountdown: 0,
    hasWispAura: false
};

export {defaultUnitData};


const additionalUnitData = {
    wispAttackBonus: 15,
    poisonAttackReduce: 10,
    poisonArmorReduce: 10
};

export {additionalUnitData};
