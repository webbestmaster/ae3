// @flow

/* eslint-disable sonarjs/no-duplicate-string */
/* eslint id-length: [ "error", { "min": 3, "max": 34, "exceptions": ["x", "y", "en", "ru"] } ] */

import type {MapType} from '../../type';

export const gibraltar: MapType = {
    meta: {
        'en-US': {
            name: 'Gibraltar',
        },
        'ru-RU': {
            name: 'Гибралтар',
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
    landscape: [['road-0', 'road-0', 'road-0'], ['road-0', 'stone-0', 'road-0'], ['road-0', 'road-0', 'road-0']],
    buildings: [
        {x: 0, y: 0, type: 'castle', userId: '0'},
        {x: 1, y: 0, type: 'farm', userId: '0'},

        {x: 2, y: 0, type: 'castle', userId: '1'},
        {x: 2, y: 1, type: 'farm', userId: '1'},

        {x: 2, y: 2, type: 'castle', userId: '2'},
        {x: 1, y: 2, type: 'farm', userId: '2'},

        {x: 0, y: 2, type: 'castle', userId: '3'},
        {x: 0, y: 1, type: 'farm', userId: '3'},
    ],
    units: [
        {x: 0, y: 0, type: 'galamar', userId: '0'},
        {x: 2, y: 0, type: 'valadorn', userId: '1'},
        {x: 2, y: 2, type: 'demon-lord', userId: '2'},
        {x: 0, y: 2, type: 'saeth', userId: '3'},
    ],
    graves: [],
};
