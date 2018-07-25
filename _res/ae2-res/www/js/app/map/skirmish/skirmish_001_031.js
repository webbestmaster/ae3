/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_031 = {
        version: 1,
        type: 'skirmish',
        size: {width: 15, height: 12},
        name: 'Water wars',
        'name-es': 'Guerras por el agua',
        'name-ru': 'Водные войны',
        isOpen: true,
        maxPlayers: 3,
        units: [
            {x: 1, y: 2, type: 'commander', ownerId: 0},
            {
                x: 2,
                y: 2,
                type: 'catapult',
                ownerId: 0
            },
            {x: 2, y: 3, type: 'catapult', ownerId: 0},
            {
                x: 1,
                y: 3,
                type: 'catapult',
                ownerId: 0
            },
            {x: 12, y: 1, type: 'commander', ownerId: 1},
            {
                x: 11,
                y: 1,
                type: 'dire-wolf',
                ownerId: 1
            },
            {x: 11, y: 2, type: 'dire-wolf', ownerId: 1},
            {
                x: 12,
                y: 2,
                type: 'dire-wolf',
                ownerId: 1
            },
            {x: 8, y: 10, type: 'commander', ownerId: 2},
            {
                x: 7,
                y: 9,
                type: 'elemental',
                ownerId: 2
            },
            {x: 8, y: 9, type: 'elemental', ownerId: 2},
            {x: 9, y: 9, type: 'elemental', ownerId: 2}
        ],
        buildings: [
            {x: 4, y: 0, type: 'farm', state: 'destroyed'},
            {
                x: 8,
                y: 0,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 0, y: 7, type: 'farm', state: 'destroyed'},
            {
                x: 1,
                y: 10,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 14, y: 11, type: 'farm', state: 'destroyed'},
            {
                x: 14,
                y: 8,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 1, y: 2, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 0,
                y: 5,
                type: 'castle',
                state: 'normal',
                ownerId: 0
            },
            {x: 0, y: 0, type: 'farm', state: 'normal', ownerId: 0},
            {
                x: 0,
                y: 2,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 4, y: 3, type: 'farm', state: 'normal', ownerId: 0},
            {
                x: 3,
                y: 4,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 12, y: 1, type: 'castle', state: 'normal', ownerId: 1},
            {
                x: 12,
                y: 5,
                type: 'castle',
                state: 'normal',
                ownerId: 1
            },
            {x: 14, y: 5, type: 'farm', state: 'normal', ownerId: 1},
            {
                x: 14,
                y: 0,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 10, y: 0, type: 'farm', state: 'normal', ownerId: 1},
            {
                x: 9,
                y: 5,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 6, y: 6, type: 'castle', state: 'normal', ownerId: 2},
            {
                x: 8,
                y: 10,
                type: 'castle',
                state: 'normal',
                ownerId: 2
            },
            {x: 7, y: 7, type: 'farm', state: 'normal', ownerId: 2},
            {
                x: 4,
                y: 8,
                type: 'farm',
                state: 'normal',
                ownerId: 2
            },
            {x: 3, y: 9, type: 'farm', state: 'normal', ownerId: 2},
            {
                x: 6,
                y: 11,
                type: 'farm',
                state: 'normal',
                ownerId: 2
            }
        ],
        terrain: {
            x0y0: 'terra-1',
            x0y1: 'terra-1',
            x0y2: 'terra-1',
            x0y3: 'terra-1',
            x0y4: 'road-1',
            x0y5: 'road-1',
            x0y6: 'road-1',
            x0y7: 'terra-1',
            x0y8: 'terra-1',
            x0y9: 'water-1',
            x0y10: 'water-1',
            x1y0: 'terra-1',
            x1y1: 'forest-2',
            x1y2: 'road-1',
            x1y3: 'road-1',
            x1y4: 'road-1',
            x1y5: 'forest-2',
            x1y6: 'road-1',
            x1y7: 'forest-1',
            x1y8: 'water-1',
            x1y9: 'water-1',
            x1y10: 'terra-1',
            x2y0: 'terra-1',
            x2y1: 'road-1',
            x2y2: 'road-1',
            x2y3: 'stone-1',
            x2y4: 'terra-1',
            x2y5: 'stone-1',
            x2y6: 'road-1',
            x2y7: 'water-1',
            x2y8: 'water-1',
            x2y9: 'stone-1',
            x2y10: 'terra-1',
            x3y0: 'terra-1',
            x3y1: 'road-1',
            x3y2: 'terra-1',
            x3y3: 'terra-1',
            x3y4: 'terra-1',
            x3y5: 'water-1',
            x3y6: 'road-1',
            x3y7: 'water-1',
            x3y8: 'terra-1',
            x3y9: 'terra-1',
            x3y10: 'terra-1',
            x4y0: 'terra-1',
            x4y1: 'road-1',
            x4y2: 'stone-1',
            x4y3: 'terra-1',
            x4y4: 'water-1',
            x4y5: 'water-1',
            x4y6: 'road-1',
            x4y7: 'water-1',
            x4y8: 'terra-1',
            x4y9: 'terra-1',
            x4y10: 'forest-1',
            x5y0: 'water-1',
            x5y1: 'road-1',
            x5y2: 'water-1',
            x5y3: 'water-1',
            x5y4: 'water-1',
            x5y5: 'water-1',
            x5y6: 'road-1',
            x5y7: 'terra-1',
            x5y8: 'road-1',
            x5y9: 'road-1',
            x5y10: 'road-1',
            x6y0: 'water-1',
            x6y1: 'road-1',
            x6y2: 'road-1',
            x6y3: 'road-1',
            x6y4: 'road-1',
            x6y5: 'road-1',
            x6y6: 'road-1',
            x6y7: 'road-1',
            x6y8: 'road-1',
            x6y9: 'forest-1',
            x6y10: 'road-1',
            x7y0: 'water-1',
            x7y1: 'road-1',
            x7y2: 'water-1',
            x7y3: 'water-1',
            x7y4: 'water-1',
            x7y5: 'water-1',
            x7y6: 'water-1',
            x7y7: 'terra-1',
            x7y8: 'forest-2',
            x7y9: 'terra-1',
            x7y10: 'road-1',
            x8y0: 'terra-1',
            x8y1: 'road-1',
            x8y2: 'stone-1',
            x8y3: 'terra-1',
            x8y4: 'terra-1',
            x8y5: 'water-1',
            x8y6: 'water-1',
            x8y7: 'water-1',
            x8y8: 'forest-1',
            x8y9: 'water-1',
            x8y10: 'road-1',
            x9y0: 'terra-1',
            x9y1: 'road-1',
            x9y2: 'terra-1',
            x9y3: 'forest-1',
            x9y4: 'terra-1',
            x9y5: 'terra-1',
            x9y6: 'water-1',
            x9y7: 'water-1',
            x9y8: 'water-1',
            x9y9: 'stone-1',
            x9y10: 'road-1',
            x10y0: 'terra-1',
            x10y1: 'road-1',
            x10y2: 'terra-1',
            x10y3: 'terra-1',
            x10y4: 'forest-2',
            x10y5: 'terra-1',
            x10y6: 'water-1',
            x10y7: 'road-1',
            x10y8: 'road-1',
            x10y9: 'road-1',
            x10y10: 'road-1',
            x11y0: 'terra-1',
            x11y1: 'road-1',
            x11y2: 'terra-1',
            x11y3: 'terra-1',
            x11y4: 'terra-1',
            x11y5: 'terra-1',
            x11y6: 'stone-1',
            x11y7: 'road-1',
            x11y8: 'water-1',
            x11y9: 'water-1',
            x11y10: 'stone-1',
            x12y0: 'terra-1',
            x12y1: 'road-1',
            x12y2: 'road-1',
            x12y3: 'road-1',
            x12y4: 'road-1',
            x12y5: 'road-1',
            x12y6: 'road-1',
            x12y7: 'road-1',
            x12y8: 'water-1',
            x12y9: 'water-1',
            x12y10: 'stone-1',
            x13y0: 'terra-1',
            x13y1: 'forest-2',
            x13y2: 'terra-1',
            x13y3: 'terra-1',
            x13y4: 'terra-1',
            x13y5: 'terra-1',
            x13y6: 'terra-1',
            x13y7: 'forest-1',
            x13y8: 'terra-1',
            x13y9: 'water-1',
            x13y10: 'water-1',
            x14y0: 'terra-1',
            x14y1: 'terra-1',
            x14y2: 'terra-1',
            x14y3: 'forest-1',
            x14y4: 'terra-1',
            x14y5: 'terra-1',
            x14y6: 'terra-1',
            x14y7: 'terra-1',
            x14y8: 'terra-1',
            x14y9: 'water-1',
            x14y10: 'water-1',
            x0y11: 'water-1',
            x1y11: 'terra-1',
            x2y11: 'forest-2',
            x3y11: 'terra-1',
            x4y11: 'terra-1',
            x5y11: 'terra-1',
            x6y11: 'terra-1',
            x7y11: 'terra-1',
            x8y11: 'terra-1',
            x9y11: 'terra-1',
            x10y11: 'forest-1',
            x11y11: 'terra-1',
            x12y11: 'terra-1',
            x13y11: 'terra-1',
            x14y11: 'terra-1'
        }
    };
})(window);
