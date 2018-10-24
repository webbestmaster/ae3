// @flow

export type TeamIdType = 'team-0' | 'team-1' | 'team-2' | 'team-3';
export type UserColorType = 'red' | 'blue' | 'green' | 'black';

type MapGuideType = {|
    +defaultMoneyList: Array<number>,
    +defaultUnitLimitList: Array<number>,
    // userIdList: Array<string>,
    +teamIdList: ['team-0', 'team-1', 'team-2', 'team-3'],
    +colorList: ['red', 'blue', 'green', 'black'],
    +size: {|
        +square: number
    |},
    +font: {|
        +unit: {|
            +width: number,
            +height: number
        |}
    |},
    +building: {|
        +farm: {|
            +name: 'farm',
            +spriteName: 'farm-gray',
            +moneyBonus: 20,
            +hitPointsBonus: 20
        |},
        +castle: {|
            +name: 'castle',
            +spriteName: 'castle-gray',
            +moneyBonus: 30,
            +hitPointsBonus: 30
        |},
        +farmDestroyed: {|
            +name: 'farmDestroyed',
            +spriteName: 'farm-destroyed',
            +moneyBonus: 0,
            +hitPointsBonus: 0
        |},
        +temple: {|
            +name: 'temple',
            +spriteName: 'temple',
            +moneyBonus: 0,
            +hitPointsBonus: 20
        |},
        +well: {|
            +name: 'well',
            +spriteName: 'well',
            +moneyBonus: 0,
            +hitPointsBonus: 20
        |}
    |},
    +landscape: {|
        +road: {|
            +pathReduce: 1,
            +armor: 0
        |},
        +bridge: {|
            +pathReduce: 1,
            +armor: 0
        |},
        +terra: {|
            +pathReduce: 1,
            +armor: 5
        |},
        +forest: {|
            +pathReduce: 2,
            +armor: 10
        |},
        +stone: {|
            +pathReduce: 3,
            +armor: 15
        |},
        +water: {|
            +pathReduce: 3,
            +armor: 0,
            +flowArmor: 15
        |},
        +hill: {|
            +pathReduce: 2,
            +armor: 10
        |}
    |},
    +landscapeUnderBuilding: {|
        +pathReduce: 1,
        +armor: 15
    |}
|};

const mapGuide: MapGuideType = {
    defaultMoneyList: [500, 1000, 2000, 5000],
    defaultUnitLimitList: [10, 15, 20, 25, 50, 99],

    teamIdList: ['team-0', 'team-1', 'team-2', 'team-3'],
    colorList: ['red', 'blue', 'green', 'black'],
    size: {
        square: 24
    },
    font: {
        unit: {
            width: 6,
            height: 7
        }
    },
    building: {
        farm: {
            name: 'farm',
            spriteName: 'farm-gray',
            moneyBonus: 20,
            hitPointsBonus: 20
        },
        castle: {
            name: 'castle',
            spriteName: 'castle-gray',
            moneyBonus: 30,
            hitPointsBonus: 30
        },
        farmDestroyed: {
            name: 'farmDestroyed',
            spriteName: 'farm-destroyed',
            moneyBonus: 0,
            hitPointsBonus: 0
        },
        temple: {
            name: 'temple',
            spriteName: 'temple',
            moneyBonus: 0,
            hitPointsBonus: 20
        },
        well: {
            name: 'well',
            spriteName: 'well',
            moneyBonus: 0,
            hitPointsBonus: 20
        }
    },
    landscape: {
        road: {
            pathReduce: 1,
            armor: 0
        },
        bridge: {
            pathReduce: 1,
            armor: 0
        },
        terra: {
            pathReduce: 1,
            armor: 5
        },
        forest: {
            pathReduce: 2,
            armor: 10
        },
        stone: {
            pathReduce: 3,
            armor: 15
        },
        water: {
            pathReduce: 3,
            armor: 0,
            flowArmor: 15
        },
        hill: {
            pathReduce: 2,
            armor: 10
        }
    },
    landscapeUnderBuilding: {
        pathReduce: 1,
        armor: 15
    }
};

export default mapGuide;
