// @flow
export type MapGuideType = {|
    defaultMoneyList: Array<number>,
    unitLimitList: Array<number>,
    userIdList: Array<string>,
    teamIdList: ['team-0', 'team-1', 'team-2', 'team-3'],
    colorList: ['black', 'blue', 'green', 'red'],
    size: {
        square: number
    },
    landscape: {
        road: {
            pathReduce: 1,
            armor: 0
        },
        terra: {
            pathReduce: 1,
            armor: 1
        },
        forest: {
            pathReduce: 2,
            armor: 2
        },
        stone: {
            pathReduce: 3,
            armor: 3
        },
        water: {
            pathReduce: 3,
            armor: 0
        },
        hill: {
            pathReduce: 2,
            armor: 0
        }
    }
|};

const mapGuide: MapGuideType = {
    defaultMoneyList: [
        500,
        1000,
        2000,
        5000
    ],
    unitLimitList: [
        10,
        15,
        20,
        25
    ],
    userIdList: [
        '0',
        '1',
        '2',
        '3'
    ],
    teamIdList: [
        'team-0',
        'team-1',
        'team-2',
        'team-3'
    ],
    colorList: [
        'black',
        'blue',
        'green',
        'red'
    ],
    size: {
        square: 24
    },
    landscape: {
        road: {
            pathReduce: 1,
            armor: 0
        },
        terra: {
            pathReduce: 1,
            armor: 1
        },
        forest: {
            pathReduce: 2,
            armor: 2
        },
        stone: {
            pathReduce: 3,
            armor: 3
        },
        water: {
            pathReduce: 3,
            armor: 0
        },
        hill: {
            pathReduce: 2,
            armor: 0
        }
    }
};

export default mapGuide;
