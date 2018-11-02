// @flow

/* eslint-disable sonarjs/no-duplicate-string */
/* eslint id-length: [ "error", { "min": 3, "max": 34, "exceptions": ["x", "y", "en", "ru"] } ] */

import type {MapType} from '../../type';

export const allBuildings: MapType = {
    meta: {
        'en-US': {
            name: 'Аll buildings',
        },
        'ru-RU': {
            name: 'Все здания',
        },
    },
    type: 'skirmish',
    userList: [
        {
            userId: '0',
            money: 0,
            teamId: 'team-0',
        },
        {
            userId: '1',
            money: 0,
            teamId: 'team-1',
        },
        {
            userId: '2',
            money: 0,
            teamId: 'team-2',
        },
        {
            userId: '3',
            money: 0,
            teamId: 'team-3',
        },
    ],
    activeUserId: '0',
    unitLimit: 0,
    defaultMoney: 0,
    landscape: new Array(11).fill(new Array(11).fill('road-0')),
    buildings: [
        {x: 1, y: 1, type: 'castle', userId: '0'},
        {x: 3, y: 1, type: 'farm', userId: '0'},
        {x: 5, y: 1, type: 'farmDestroyed'},
        {x: 7, y: 1, type: 'well'},
        {x: 9, y: 1, type: 'temple'},

        {x: 1, y: 3, type: 'castle', userId: '1'},
        {x: 3, y: 3, type: 'farm', userId: '1'},
        {x: 5, y: 3, type: 'farmDestroyed'},
        {x: 7, y: 3, type: 'well'},
        {x: 9, y: 3, type: 'temple'},

        {x: 1, y: 5, type: 'castle', userId: '2'},
        {x: 3, y: 5, type: 'farm', userId: '2'},
        {x: 5, y: 5, type: 'farmDestroyed'},
        {x: 7, y: 5, type: 'well'},
        {x: 9, y: 5, type: 'temple'},

        {x: 1, y: 7, type: 'castle', userId: '3'},
        {x: 3, y: 7, type: 'farm', userId: '3'},
        {x: 5, y: 7, type: 'farmDestroyed'},
        {x: 7, y: 7, type: 'well'},
        {x: 9, y: 7, type: 'temple'},

        {x: 1, y: 9, type: 'castle'},
        {x: 3, y: 9, type: 'farm'},
        {x: 5, y: 9, type: 'farmDestroyed'},
        {x: 7, y: 9, type: 'well'},
        {x: 9, y: 9, type: 'temple'},
    ],
    units: [
        {x: 0, y: 0, type: 'galamar', userId: '0'},
        {x: 0, y: 2, type: 'valadorn', userId: '1'},
        {x: 0, y: 4, type: 'demon-lord', userId: '2'},
        {x: 0, y: 6, type: 'saeth', userId: '3'},
    ],
    graves: [],
};
