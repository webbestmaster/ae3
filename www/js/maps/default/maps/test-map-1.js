// @flow

/* eslint id-length: [ "error", { "min": 3, "max": 34, "exceptions": ["x", "y", "en", "ru"] } ] */

import type {MapType} from './../../type';

export const testMap1: MapType = {
    meta: {
        'en-US': {
            name: 'my test map 1 (Cycle)'
        },
        'ru-RU': {
            name: 'моя тестовая карта 1 (Цикл)'
        }
    },
    type: 'skirmish',
    userList: [
        {
            userId: '0',
            money: 0,
            teamId: 'team-0'
        },
        {
            userId: '1',
            money: 0,
            teamId: 'team-1'
        },
        {
            userId: '2',
            money: 0,
            teamId: 'team-2'
        },
        {
            userId: '3',
            money: 0,
            teamId: 'team-3'
        }
    ],
    activeUserId: '0',
    unitLimit: 0,
    defaultMoney: 0,
    landscape: [
        [
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'water-0',
            'water-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0'
        ],
        [
            'road-0',
            'terra-0',
            'terra-0',
            'forest-0',
            'road-0',
            'water-0',
            'water-0',
            'road-0',
            'terra-0',
            'forest-0',
            'terra-0',
            'road-0'
        ],
        [
            'road-0',
            'terra-0',
            'forest-0',
            'forest-0',
            'road-0',
            'bridge-0',
            'bridge-0',
            'road-0',
            'forest-0',
            'terra-0',
            'hill-0',
            'road-0'
        ],
        [
            'road-0',
            'terra-0',
            'hill-0',
            'stone-0',
            'road-0',
            'terra-0',
            'forest-0',
            'road-0',
            'terra-0',
            'forest-0',
            'terra-0',
            'road-0'
        ],
        [
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'stone-0',
            'stone-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0'
        ],
        [
            'stone-0',
            'hill-0',
            'road-0',
            'terra-0',
            'stone-0',
            'terra-0',
            'terra-0',
            'stone-0',
            'stone-0',
            'road-0',
            'forest-0',
            'stone-0'
        ],
        [
            'terra-0',
            'stone-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'stone-0',
            'terra-0'
        ],
        [
            'stone-0',
            'forest-0',
            'road-0',
            'stone-0',
            'stone-0',
            'terra-0',
            'terra-0',
            'stone-0',
            'terra-0',
            'road-0',
            'hill-0',
            'stone-0'
        ],
        [
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'stone-0',
            'stone-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0'
        ],
        [
            'road-0',
            'terra-0',
            'forest-0',
            'stone-0',
            'road-0',
            'forest-0',
            'terra-0',
            'road-0',
            'stone-0',
            'hill-0',
            'terra-0',
            'road-0'
        ],
        [
            'road-0',
            'hill-0',
            'terra-0',
            'forest-0',
            'road-0',
            'bridge-0',
            'bridge-0',
            'road-0',
            'forest-0',
            'forest-0',
            'terra-0',
            'road-0'
        ],
        [
            'road-0',
            'terra-0',
            'forest-0',
            'terra-0',
            'road-0',
            'water-0',
            'water-0',
            'road-0',
            'forest-0',
            'terra-0',
            'terra-0',
            'road-0'
        ],
        [
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'water-0',
            'water-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0',
            'road-0'
        ]
    ],
    buildings: [
        {x: 1, y: 1, type: 'castle', userId: '0'},
        {x: 1, y: 3, type: 'farm', userId: '0'},

        {x: 9, y: 2, type: 'castle', userId: '1'},
        {x: 10, y: 3, type: 'farm', userId: '1'},

        {x: 2, y: 10, type: 'castle', userId: '2'},
        {x: 1, y: 9, type: 'farm', userId: '2'},

        {x: 10, y: 11, type: 'castle', userId: '3'},
        {x: 10, y: 9, type: 'farm', userId: '3'},

        {x: 5, y: 5, type: 'farm-destroyed'},
        {x: 6, y: 5, type: 'farm-destroyed'},
        {x: 5, y: 7, type: 'farm-destroyed'},
        {x: 6, y: 7, type: 'farm-destroyed'}
    ],
    units: [
        {x: 1, y: 1, type: 'galamar', userId: '0'},
        {x: 9, y: 2, type: 'valadorn', userId: '1'},
        {x: 2, y: 10, type: 'demon-lord', userId: '2'},
        {x: 10, y: 11, type: 'saeth', userId: '3'}
    ],
    graves: []
};
