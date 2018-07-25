/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_044 = {
        type: 'skirmish',
        size: {width: 17, height: 16},
        name: 'Double punch',
        'name-es': 'Doble golpe',
        'name-ru': 'Двойной удар',
        isOpen: true,
        maxPlayers: 4,
        units: [
            {x: 8, y: 2, type: 'commander', ownerId: 3},
            {
                x: 8,
                y: 3,
                type: 'dragon',
                ownerId: 3
            },
            {x: 8, y: 14, type: 'commander', ownerId: 2},
            {
                x: 6,
                y: 15,
                type: 'dire-wolf',
                ownerId: 2
            },
            {x: 10, y: 15, type: 'dire-wolf', ownerId: 2},
            {
                x: 8,
                y: 15,
                type: 'archer',
                ownerId: 2
            },
            {x: 7, y: 14, type: 'elemental', ownerId: 2},
            {
                x: 9,
                y: 14,
                type: 'elemental',
                ownerId: 2
            },
            {x: 2, y: 8, type: 'commander', ownerId: 1},
            {
                x: 2,
                y: 9,
                type: 'dragon',
                ownerId: 1
            },
            {x: 14, y: 8, type: 'commander', ownerId: 0},
            {x: 14, y: 9, type: 'dragon', ownerId: 0}
        ],
        buildings: [
            {x: 14, y: 9, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 16,
                y: 7,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 16, y: 11, type: 'farm', state: 'normal', ownerId: 0},
            {
                x: 16,
                y: 15,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 8, y: 2, type: 'castle', state: 'normal', ownerId: 3},
            {
                x: 7,
                y: 1,
                type: 'farm',
                state: 'normal',
                ownerId: 3
            },
            {x: 9, y: 1, type: 'farm', state: 'normal', ownerId: 3},
            {
                x: 5,
                y: 13,
                type: 'castle',
                state: 'normal',
                ownerId: 2
            },
            {x: 11, y: 13, type: 'castle', state: 'normal', ownerId: 2},
            {
                x: 0,
                y: 15,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 0, y: 11, type: 'farm', state: 'normal', ownerId: 1},
            {
                x: 0,
                y: 9,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 0, y: 7, type: 'farm', state: 'normal', ownerId: 1},
            {
                x: 0,
                y: 12,
                type: 'well',
                state: 'normal'
            },
            {x: 16, y: 12, type: 'well', state: 'normal'},
            {
                x: 2,
                y: 9,
                type: 'castle',
                state: 'normal',
                ownerId: 1
            },
            {x: 1, y: 4, type: 'castle', state: 'normal'},
            {
                x: 15,
                y: 4,
                type: 'castle',
                state: 'normal'
            },
            {x: 13, y: 15, type: 'farm', state: 'destroyed'},
            {
                x: 3,
                y: 15,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 6, y: 9, type: 'castle', state: 'normal'},
            {
                x: 10,
                y: 9,
                type: 'castle',
                state: 'normal'
            },
            {x: 12, y: 7, type: 'castle', state: 'normal'},
            {
                x: 4,
                y: 7,
                type: 'castle',
                state: 'normal'
            },
            {x: 5, y: 5, type: 'castle', state: 'normal'},
            {
                x: 12,
                y: 5,
                type: 'castle',
                state: 'normal'
            },
            {x: 7, y: 4, type: 'castle', state: 'normal'},
            {
                x: 9,
                y: 4,
                type: 'castle',
                state: 'normal'
            },
            {x: 13, y: 0, type: 'castle', state: 'normal'},
            {
                x: 3,
                y: 0,
                type: 'castle',
                state: 'normal'
            },
            {x: 2, y: 1, type: 'farm', state: 'normal', ownerId: 2},
            {
                x: 14,
                y: 1,
                type: 'farm',
                state: 'normal',
                ownerId: 2
            }
        ],
        terrain: {
            x0y0: 'stone-1',
            x0y1: 'stone-1',
            x0y2: 'terra-1',
            x0y3: 'stone-1',
            x0y4: 'terra-1',
            x0y5: 'road-1',
            x0y6: 'forest-1',
            x0y7: 'terra-1',
            x0y8: 'forest-2',
            x0y9: 'terra-1',
            x0y10: 'terra-1',
            x1y0: 'forest-2',
            x1y1: 'terra-1',
            x1y2: 'forest-2',
            x1y3: 'forest-1',
            x1y4: 'road-1',
            x1y5: 'road-1',
            x1y6: 'hill-1',
            x1y7: 'stone-1',
            x1y8: 'forest-2',
            x1y9: 'terra-1',
            x1y10: 'hill-1',
            x2y0: 'terra-1',
            x2y1: 'terra-1',
            x2y2: 'forest-2',
            x2y3: 'hill-1',
            x2y4: 'terra-1',
            x2y5: 'road-1',
            x2y6: 'forest-2',
            x2y7: 'stone-1',
            x2y8: 'hill-1',
            x2y9: 'road-1',
            x2y10: 'terra-1',
            x3y0: 'road-1',
            x3y1: 'terra-1',
            x3y2: 'hill-1',
            x3y3: 'road-1',
            x3y4: 'road-1',
            x3y5: 'road-1',
            x3y6: 'road-1',
            x3y7: 'road-1',
            x3y8: 'road-1',
            x3y9: 'road-1',
            x3y10: 'road-1',
            x4y0: 'terra-1',
            x4y1: 'road-1',
            x4y2: 'road-1',
            x4y3: 'road-1',
            x4y4: 'terra-1',
            x4y5: 'terra-1',
            x4y6: 'terra-1',
            x4y7: 'road-1',
            x4y8: 'terra-1',
            x4y9: 'stone-1',
            x4y10: 'terra-1',
            x5y0: 'stone-1',
            x5y1: 'road-1',
            x5y2: 'stone-1',
            x5y3: 'forest-1',
            x5y4: 'stone-1',
            x5y5: 'road-1',
            x5y6: 'road-1',
            x5y7: 'road-1',
            x5y8: 'terra-1',
            x5y9: 'hill-1',
            x5y10: 'terra-1',
            x6y0: 'hill-1',
            x6y1: 'road-1',
            x6y2: 'road-1',
            x6y3: 'road-1',
            x6y4: 'hill-1',
            x6y5: 'forest-1',
            x6y6: 'terra-1',
            x6y7: 'road-1',
            x6y8: 'forest-1',
            x6y9: 'road-1',
            x6y10: 'terra-1',
            x7y0: 'forest-2',
            x7y1: 'terra-1',
            x7y2: 'terra-1',
            x7y3: 'road-1',
            x7y4: 'road-1',
            x7y5: 'terra-1',
            x7y6: 'water-1',
            x7y7: 'bridge-1',
            x7y8: 'water-1',
            x7y9: 'terra-1',
            x7y10: 'stone-1',
            x8y0: 'stone-1',
            x8y1: 'terra-1',
            x8y2: 'road-1',
            x8y3: 'road-1',
            x8y4: 'road-1',
            x8y5: 'bridge-2',
            x8y6: 'bridge-2',
            x8y7: 'bridge-1',
            x8y8: 'bridge-2',
            x8y9: 'bridge-2',
            x8y10: 'road-1',
            x9y0: 'forest-2',
            x9y1: 'terra-1',
            x9y2: 'terra-1',
            x9y3: 'road-1',
            x9y4: 'road-1',
            x9y5: 'terra-1',
            x9y6: 'water-1',
            x9y7: 'bridge-1',
            x9y8: 'water-1',
            x9y9: 'terra-1',
            x9y10: 'stone-1',
            x10y0: 'hill-1',
            x10y1: 'road-1',
            x10y2: 'road-1',
            x10y3: 'road-1',
            x10y4: 'hill-1',
            x10y5: 'forest-1',
            x10y6: 'terra-1',
            x10y7: 'road-1',
            x10y8: 'forest-1',
            x10y9: 'road-1',
            x10y10: 'terra-1',
            x11y0: 'stone-1',
            x11y1: 'road-1',
            x11y2: 'stone-1',
            x11y3: 'forest-2',
            x11y4: 'stone-1',
            x11y5: 'terra-1',
            x11y6: 'road-1',
            x11y7: 'road-1',
            x11y8: 'terra-1',
            x11y9: 'hill-1',
            x11y10: 'terra-1',
            x12y0: 'terra-1',
            x12y1: 'road-1',
            x12y2: 'road-1',
            x12y3: 'road-1',
            x12y4: 'terra-1',
            x12y5: 'road-1',
            x12y6: 'terra-1',
            x12y7: 'road-1',
            x12y8: 'terra-1',
            x12y9: 'stone-1',
            x12y10: 'terra-1',
            x13y0: 'road-1',
            x13y1: 'terra-1',
            x13y2: 'hill-1',
            x13y3: 'road-1',
            x13y4: 'road-1',
            x13y5: 'road-1',
            x13y6: 'road-1',
            x13y7: 'road-1',
            x13y8: 'road-1',
            x13y9: 'road-1',
            x13y10: 'road-1',
            x14y0: 'terra-1',
            x14y1: 'terra-1',
            x14y2: 'forest-2',
            x14y3: 'hill-1',
            x14y4: 'terra-1',
            x14y5: 'road-1',
            x14y6: 'forest-2',
            x14y7: 'stone-1',
            x14y8: 'hill-1',
            x14y9: 'road-1',
            x14y10: 'terra-1',
            x15y0: 'forest-2',
            x15y1: 'terra-1',
            x15y2: 'forest-2',
            x15y3: 'forest-1',
            x15y4: 'road-1',
            x15y5: 'road-1',
            x15y6: 'hill-1',
            x15y7: 'stone-1',
            x15y8: 'forest-2',
            x15y9: 'terra-1',
            x15y10: 'hill-1',
            x16y0: 'stone-1',
            x16y1: 'stone-1',
            x16y2: 'terra-1',
            x16y3: 'stone-1',
            x16y4: 'terra-1',
            x16y5: 'road-1',
            x16y6: 'forest-1',
            x16y7: 'terra-1',
            x16y8: 'forest-2',
            x16y9: 'forest-2',
            x16y10: 'terra-1',
            x0y11: 'terra-1',
            x1y11: 'terra-1',
            x2y11: 'terra-1',
            x3y11: 'road-1',
            x4y11: 'road-1',
            x5y11: 'stone-1',
            x6y11: 'terra-1',
            x7y11: 'terra-1',
            x8y11: 'road-1',
            x9y11: 'terra-1',
            x10y11: 'forest-1',
            x11y11: 'stone-1',
            x12y11: 'road-1',
            x13y11: 'road-1',
            x14y11: 'forest-1',
            x15y11: 'terra-1',
            x16y11: 'terra-1',
            x0y12: 'road-1',
            x1y12: 'water-1',
            x2y12: 'water-1',
            x3y12: 'stone-1',
            x4y12: 'road-1',
            x5y12: 'road-1',
            x6y12: 'road-1',
            x7y12: 'road-1',
            x8y12: 'road-1',
            x9y12: 'road-1',
            x10y12: 'road-1',
            x11y12: 'road-1',
            x12y12: 'road-1',
            x13y12: 'stone-1',
            x14y12: 'water-1',
            x15y12: 'water-1',
            x16y12: 'road-1',
            x0y13: 'forest-2',
            x1y13: 'water-1',
            x2y13: 'water-1',
            x3y13: 'stone-1',
            x4y13: 'forest-1',
            x5y13: 'road-1',
            x6y13: 'hill-1',
            x7y13: 'water-1',
            x8y13: 'road-1',
            x9y13: 'water-1',
            x10y13: 'hill-1',
            x11y13: 'road-1',
            x12y13: 'forest-1',
            x13y13: 'stone-1',
            x14y13: 'water-1',
            x15y13: 'water-1',
            x16y13: 'forest-2',
            x0y14: 'terra-1',
            x1y14: 'water-1',
            x2y14: 'water-1',
            x3y14: 'hill-1',
            x4y14: 'forest-1',
            x5y14: 'terra-1',
            x6y14: 'stone-1',
            x7y14: 'water-1',
            x8y14: 'road-1',
            x9y14: 'water-1',
            x10y14: 'stone-1',
            x11y14: 'terra-1',
            x12y14: 'forest-1',
            x13y14: 'hill-1',
            x14y14: 'water-1',
            x15y14: 'water-1',
            x16y14: 'terra-1',
            x0y15: 'terra-1',
            x1y15: 'stone-1',
            x2y15: 'stone-1',
            x3y15: 'terra-1',
            x4y15: 'road-1',
            x5y15: 'road-1',
            x6y15: 'road-1',
            x7y15: 'bridge-1',
            x8y15: 'road-1',
            x9y15: 'bridge-1',
            x10y15: 'road-1',
            x11y15: 'road-1',
            x12y15: 'road-1',
            x13y15: 'terra-1',
            x14y15: 'stone-1',
            x15y15: 'stone-1',
            x16y15: 'terra-1'
        }
    };
})(window);
