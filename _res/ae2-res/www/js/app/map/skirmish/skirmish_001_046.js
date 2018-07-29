/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_046 = {
        type: 'skirmish',
        size: {width: 16, height: 16},
        name: 'The sign of four',
        'name-es': 'El signo de los cuatro',
        'name-ru': 'Знак четырех',
        isOpen: true,
        maxPlayers: 4,
        units: [
            {x: 0, y: 0, type: 'commander', ownerId: 3},
            {
                x: 2,
                y: 3,
                type: 'dragon',
                ownerId: 3
            },
            {x: 9, y: 9, type: 'commander', ownerId: 0},
            {
                x: 8,
                y: 8,
                type: 'dragon',
                ownerId: 0
            },
            {x: 8, y: 10, type: 'dragon', ownerId: 0},
            {
                x: 15,
                y: 6,
                type: 'commander',
                ownerId: 1
            },
            {x: 15, y: 5, type: 'catapult', ownerId: 1},
            {
                x: 15,
                y: 7,
                type: 'catapult',
                ownerId: 1
            },
            {x: 6, y: 15, type: 'commander', ownerId: 2},
            {
                x: 5,
                y: 15,
                type: 'golem',
                ownerId: 2
            },
            {x: 7, y: 15, type: 'golem', ownerId: 2}
        ],
        buildings: [
            {x: 0, y: 0, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 2,
                y: 0,
                type: 'castle',
                state: 'normal',
                ownerId: 3
            },
            {x: 4, y: 0, type: 'castle', state: 'normal', ownerId: 3},
            {
                x: 11,
                y: 0,
                type: 'castle',
                state: 'normal'
            },
            {x: 14, y: 3, type: 'farm', state: 'normal'},
            {
                x: 9,
                y: 2,
                type: 'farm',
                state: 'normal'
            },
            {x: 5, y: 3, type: 'castle', state: 'normal'},
            {
                x: 6,
                y: 5,
                type: 'farm',
                state: 'normal'
            },
            {x: 1, y: 6, type: 'farm', state: 'normal'},
            {
                x: 11,
                y: 7,
                type: 'farm',
                state: 'normal'
            },
            {x: 13, y: 13, type: 'farm', state: 'normal'},
            {
                x: 8,
                y: 6,
                type: 'temple',
                state: 'normal'
            },
            {x: 2, y: 10, type: 'castle', state: 'normal'},
            {
                x: 9,
                y: 6,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 15, y: 6, type: 'castle', state: 'normal', ownerId: 1},
            {
                x: 12,
                y: 5,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 13, y: 9, type: 'farm', state: 'normal', ownerId: 1},
            {
                x: 15,
                y: 11,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 15, y: 10, type: 'castle', state: 'normal', ownerId: 1},
            {
                x: 5,
                y: 8,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 7, y: 7, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 8,
                y: 9,
                type: 'castle',
                state: 'normal',
                ownerId: 0
            },
            {x: 6, y: 15, type: 'castle', state: 'normal', ownerId: 2},
            {
                x: 9,
                y: 13,
                type: 'farm',
                state: 'normal',
                ownerId: 2
            },
            {x: 10, y: 15, type: 'farm', state: 'normal', ownerId: 2},
            {
                x: 11,
                y: 13,
                type: 'castle',
                state: 'normal',
                ownerId: 2
            },
            {x: 4, y: 12, type: 'farm', state: 'normal', ownerId: 2}
        ],
        terrain: {
            x0y0: 'road-1',
            x0y1: 'terra-1',
            x0y2: 'forest-1',
            x0y3: 'hill-1',
            x0y4: 'forest-2',
            x0y5: 'terra-1',
            x0y6: 'terra-1',
            x0y7: 'forest-2',
            x0y8: 'stone-1',
            x0y9: 'terra-1',
            x0y10: 'water-1',
            x1y0: 'terra-1',
            x1y1: 'terra-1',
            x1y2: 'terra-1',
            x1y3: 'terra-2',
            x1y4: 'terra-1',
            x1y5: 'hill-1',
            x1y6: 'terra-1',
            x1y7: 'terra-1',
            x1y8: 'terra-1',
            x1y9: 'terra-1',
            x1y10: 'water-1',
            x2y0: 'road-1',
            x2y1: 'terra-1',
            x2y2: 'terra-5',
            x2y3: 'terra-3',
            x2y4: 'terra-1',
            x2y5: 'forest-2',
            x2y6: 'terra-1',
            x2y7: 'terra-1',
            x2y8: 'forest-1',
            x2y9: 'terra-1',
            x2y10: 'road-1',
            x3y0: 'terra-1',
            x3y1: 'terra-1',
            x3y2: 'terra-1',
            x3y3: 'terra-4',
            x3y4: 'terra-1',
            x3y5: 'stone-1',
            x3y6: 'terra-1',
            x3y7: 'stone-1',
            x3y8: 'terra-1',
            x3y9: 'hill-1',
            x3y10: 'terra-1',
            x4y0: 'road-1',
            x4y1: 'hill-1',
            x4y2: 'terra-1',
            x4y3: 'forest-1',
            x4y4: 'hill-1',
            x4y5: 'forest-2',
            x4y6: 'hill-1',
            x4y7: 'terra-1',
            x4y8: 'terra-1',
            x4y9: 'terra-1',
            x4y10: 'stone-1',
            x5y0: 'terra-1',
            x5y1: 'terra-1',
            x5y2: 'hill-1',
            x5y3: 'road-1',
            x5y4: 'forest-1',
            x5y5: 'terra-1',
            x5y6: 'water-1',
            x5y7: 'water-1',
            x5y8: 'terra-1',
            x5y9: 'terra-1',
            x5y10: 'stone-1',
            x6y0: 'terra-1',
            x6y1: 'forest-2',
            x6y2: 'forest-1',
            x6y3: 'terra-1',
            x6y4: 'terra-1',
            x6y5: 'terra-1',
            x6y6: 'water-1',
            x6y7: 'water-1',
            x6y8: 'terra-1',
            x6y9: 'forest-2',
            x6y10: 'terra-1',
            x7y0: 'forest-2',
            x7y1: 'stone-1',
            x7y2: 'terra-1',
            x7y3: 'hill-1',
            x7y4: 'forest-2',
            x7y5: 'terra-1',
            x7y6: 'terra-1',
            x7y7: 'road-1',
            x7y8: 'terra-1',
            x7y9: 'terra-1',
            x7y10: 'forest-1',
            x8y0: 'hill-1',
            x8y1: 'terra-1',
            x8y2: 'terra-1',
            x8y3: 'forest-1',
            x8y4: 'stone-1',
            x8y5: 'terra-1',
            x8y6: 'road-1',
            x8y7: 'terra-1',
            x8y8: 'stone-1',
            x8y9: 'road-1',
            x8y10: 'road-1',
            x9y0: 'terra-1',
            x9y1: 'hill-1',
            x9y2: 'terra-1',
            x9y3: 'terra-1',
            x9y4: 'terra-1',
            x9y5: 'hill-1',
            x9y6: 'terra-1',
            x9y7: 'hill-1',
            x9y8: 'forest-1',
            x9y9: 'terra-1',
            x9y10: 'water-1',
            x10y0: 'forest-2',
            x10y1: 'terra-1',
            x10y2: 'terra-1',
            x10y3: 'forest-2',
            x10y4: 'hill-1',
            x10y5: 'water-1',
            x10y6: 'water-1',
            x10y7: 'terra-1',
            x10y8: 'hill-1',
            x10y9: 'stone-1',
            x10y10: 'road-1',
            x11y0: 'road-1',
            x11y1: 'terra-1',
            x11y2: 'hill-1',
            x11y3: 'forest-1',
            x11y4: 'terra-1',
            x11y5: 'water-1',
            x11y6: 'water-1',
            x11y7: 'terra-1',
            x11y8: 'terra-1',
            x11y9: 'forest-1',
            x11y10: 'road-1',
            x12y0: 'terra-1',
            x12y1: 'stone-1',
            x12y2: 'terra-1',
            x12y3: 'stone-1',
            x12y4: 'hill-1',
            x12y5: 'terra-1',
            x12y6: 'road-1',
            x12y7: 'road-1',
            x12y8: 'road-1',
            x12y9: 'road-1',
            x12y10: 'road-1',
            x13y0: 'forest-2',
            x13y1: 'forest-1',
            x13y2: 'forest-2',
            x13y3: 'terra-1',
            x13y4: 'terra-1',
            x13y5: 'hill-1',
            x13y6: 'road-1',
            x13y7: 'forest-2',
            x13y8: 'stone-1',
            x13y9: 'terra-1',
            x13y10: 'forest-1',
            x14y0: 'terra-1',
            x14y1: 'terra-1',
            x14y2: 'hill-1',
            x14y3: 'terra-1',
            x14y4: 'forest-2',
            x14y5: 'terra-1',
            x14y6: 'road-1',
            x14y7: 'terra-1',
            x14y8: 'terra-1',
            x14y9: 'stone-1',
            x14y10: 'terra-1',
            x15y0: 'terra-1',
            x15y1: 'stone-1',
            x15y2: 'terra-1',
            x15y3: 'terra-1',
            x15y4: 'stone-1',
            x15y5: 'stone-1',
            x15y6: 'road-1',
            x15y7: 'forest-2',
            x15y8: 'terra-1',
            x15y9: 'forest-2',
            x15y10: 'road-1',
            x0y11: 'water-1',
            x1y11: 'water-1',
            x2y11: 'terra-1',
            x3y11: 'hill-1',
            x4y11: 'terra-1',
            x5y11: 'water-1',
            x6y11: 'water-1',
            x7y11: 'terra-1',
            x8y11: 'road-1',
            x9y11: 'road-1',
            x10y11: 'road-1',
            x11y11: 'terra-1',
            x12y11: 'terra-1',
            x13y11: 'hill-1',
            x14y11: 'stone-1',
            x15y11: 'terra-1',
            x0y12: 'terra-1',
            x1y12: 'stone-1',
            x2y12: 'hill-1',
            x3y12: 'terra-1',
            x4y12: 'terra-1',
            x5y12: 'water-1',
            x6y12: 'water-1',
            x7y12: 'stone-1',
            x8y12: 'terra-1',
            x9y12: 'forest-2',
            x10y12: 'road-1',
            x11y12: 'terra-1',
            x12y12: 'stone-1',
            x13y12: 'hill-1',
            x14y12: 'terra-1',
            x15y12: 'terra-1',
            x0y13: 'terra-1',
            x1y13: 'terra-1',
            x2y13: 'hill-1',
            x3y13: 'forest-1',
            x4y13: 'terra-1',
            x5y13: 'water-1',
            x6y13: 'water-1',
            x7y13: 'hill-1',
            x8y13: 'stone-1',
            x9y13: 'terra-1',
            x10y13: 'road-1',
            x11y13: 'road-1',
            x12y13: 'terra-1',
            x13y13: 'terra-1',
            x14y13: 'hill-1',
            x15y13: 'forest-2',
            x0y14: 'stone-1',
            x1y14: 'terra-1',
            x2y14: 'forest-2',
            x3y14: 'terra-1',
            x4y14: 'hill-1',
            x5y14: 'terra-1',
            x6y14: 'road-1',
            x7y14: 'road-1',
            x8y14: 'road-1',
            x9y14: 'road-1',
            x10y14: 'road-1',
            x11y14: 'terra-1',
            x12y14: 'forest-1',
            x13y14: 'terra-1',
            x14y14: 'stone-1',
            x15y14: 'terra-1',
            x0y15: 'terra-1',
            x1y15: 'forest-2',
            x2y15: 'water-1',
            x3y15: 'water-1',
            x4y15: 'terra-1',
            x5y15: 'hill-1',
            x6y15: 'road-1',
            x7y15: 'stone-1',
            x8y15: 'terra-1',
            x9y15: 'forest-2',
            x10y15: 'terra-1',
            x11y15: 'forest-2',
            x12y15: 'stone-1',
            x13y15: 'hill-1',
            x14y15: 'terra-1',
            x15y15: 'terra-1'
        }
    };
})(window);