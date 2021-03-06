// @flow

/* eslint-disable sonarjs/no-duplicate-string */
/* eslint id-length: [ "error", { "min": 3, "max": 34, "exceptions": ["x", "y", "en", "ru"] } ] */

import type {MapType} from '../../type';

export const myFirstMap: MapType = {
    meta: {
        'en-US': {
            name: 'my first map',
        },
        'ru-RU': {
            name: 'моя первая карта',
        },
    },
    type: 'skirmish',
    userList: [
        {
            userId: '0',
            money: 0,
            teamId: 'team-0',
            isLeaved: false,
            commander: {
                type: 'galamar',
                buyCount: 0,
            },
        },
        {
            userId: '1',
            money: 0,
            teamId: 'team-1',
            isLeaved: false,
            commander: {
                type: 'valadorn',
                buyCount: 0,
            },
        },
    ],
    activeUserId: '0',
    unitLimit: 0,
    defaultMoney: 0,
    landscape: [
        [
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'road-0',
            'forest-0',
            'road-0',
            'forest-0',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        ['forest-0', 'forest-0', 'road-0', 'road-0', 'road-0', 'hill-0', 'forest-0', 'forest-0', 'road-0', 'forest-0'],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        [
            'forest-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-1',
            'hill-0',
            'forest-0',
            'forest-0',
            'road-0',
            'forest-0',
        ],
        ['water-0', 'water-0', 'water-0', 'water-0', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
        ['water-0', 'water-1', 'water-1', 'water-1', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
        ['water-0', 'water-0', 'water-0', 'water-2', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
        ['water-0', 'water-0', 'water-0', 'water-2', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
        ['water-0', 'water-0', 'water-0', 'water-2', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
        ['water-0', 'water-0', 'water-0', 'water-0', 'water-1', 'water-0', 'water-0', 'water-0', 'water-0', 'water-0'],
    ],
    buildings: [
        {
            x: 0,
            y: 0,
            type: 'castle',
            userId: '0',
        },
        {
            x: 1,
            y: 1,
            type: 'castle',
            userId: '0',
        },
        {
            x: 3,
            y: 2,
            type: 'farm',
            userId: '0',
        },
        {
            x: 2,
            y: 2,
            type: 'farm',
            userId: '1',
        },
        {
            x: 2,
            y: 5,
            type: 'castle',
            userId: '0',
        },
        {
            x: 5,
            y: 5,
            type: 'well',
        },
        {
            x: 5,
            y: 6,
            type: 'temple',
        },
        {
            x: 4,
            y: 3,
            type: 'farmDestroyed',
        },
        {
            x: 6,
            y: 5,
            type: 'castle',
            userId: '1',
        },
        {
            x: 6,
            y: 6,
            type: 'castle',
            userId: '1',
        },
        {
            x: 5,
            y: 3,
            type: 'farm',
            userId: '1',
        },
    ],
    units: [
        // {
        //     x: 0,
        //     y: 0,
        //     type: 'soldier',
        //     userId: '0',
        // },
        {
            x: 3,
            y: 3,
            type: 'soldier',
            userId: '0',
        },
        {
            x: 1,
            y: 0,
            type: 'archer',
            userId: '0',
        },
        {
            x: 2,
            y: 0,
            type: 'elemental',
            userId: '0',
        },
        {
            x: 2,
            y: 9,
            type: 'elemental',
            userId: '0',
        },
        {
            x: 3,
            y: 0,
            type: 'sorceress',
            userId: '0',
        },
        {
            x: 5,
            y: 6,
            type: 'sorceress',
            userId: '0',
        },
        {
            x: 4,
            y: 0,
            type: 'wisp',
            userId: '0',
        },
        {
            x: 5,
            y: 0,
            type: 'wisp',
            userId: '0',
        },
        {
            x: 6,
            y: 0,
            type: 'dire-wolf',
            userId: '0',
        },
        {
            x: 5,
            y: 2,
            type: 'dire-wolf',
            userId: '0',
        },
        {
            x: 0,
            y: 1,
            type: 'golem',
            userId: '0',
        },
        {
            x: 1,
            y: 1,
            type: 'catapult',
            userId: '0',
        },
        {
            x: 2,
            y: 3,
            type: 'catapult',
            userId: '0',
        },
        {
            x: 2,
            y: 1,
            type: 'dragon',
            userId: '0',
        },
        {
            x: 7,
            y: 7,
            type: 'dragon',
            userId: '0',
        },
        {
            x: 3,
            y: 1,
            type: 'skeleton',
            userId: '0',
        },
        {
            x: 4,
            y: 1,
            type: 'crystal',
            userId: '0',
        },
        {
            x: 5,
            y: 1,
            type: 'galamar',
            userId: '0',
        },
        {
            x: 6,
            y: 1,
            type: 'soldier',
            userId: '0',
        },
        {
            x: 7,
            y: 1,
            type: 'soldier',
            userId: '0',
        },
        {
            x: 8,
            y: 1,
            type: 'soldier',
            userId: '0',
        },
        {
            x: 3,
            y: 4,
            type: 'soldier',
            userId: '1',
        },
        {
            x: 4,
            y: 4,
            type: 'soldier',
            userId: '1',
        },
        {
            x: 5,
            y: 4,
            type: 'dire-wolf',
            userId: '1',
        },

        {
            x: 0,
            y: 0,
            type: 'soldier',
            userId: '1',
        },
        {
            x: 9,
            y: 0,
            type: 'soldier',
            userId: '1',
        },
        {
            x: 9,
            y: 14,
            type: 'soldier',
            userId: '1',
        },
        {
            x: 0,
            y: 14,
            type: 'soldier',
            userId: '1',
        },
    ],
    graves: [
        {
            x: 6,
            y: 6,
            removeCountdown: 3,
        },
    ],
};
