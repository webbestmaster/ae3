/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_049 = {
        type: 'skirmish',
        size: {width: 12, height: 13},
        name: 'Cycle',
        'name-es': 'Ciclo',
        'name-ru': 'Круговорот',
        isOpen: true,
        maxPlayers: 4,
        units: [
            {x: 9, y: 2, type: 'commander', ownerId: 0},
            {
                x: 8,
                y: 2,
                type: 'archer',
                ownerId: 0
            },
            {x: 9, y: 3, type: 'archer', ownerId: 0},
            {
                x: 1,
                y: 1,
                type: 'commander',
                ownerId: 1
            },
            {x: 2, y: 1, type: 'archer', ownerId: 1},
            {x: 1, y: 2, type: 'archer', ownerId: 1},
            {
                x: 10,
                y: 11,
                type: 'commander',
                ownerId: 2
            },
            {x: 10, y: 10, type: 'archer', ownerId: 2},
            {
                x: 9,
                y: 11,
                type: 'archer',
                ownerId: 2
            },
            {x: 2, y: 10, type: 'commander', ownerId: 3},
            {
                x: 2,
                y: 9,
                type: 'archer',
                ownerId: 3
            },
            {x: 3, y: 10, type: 'archer', ownerId: 3}
        ],
        buildings: [
            {x: 5, y: 5, type: 'farm', state: 'destroyed'},
            {
                x: 6,
                y: 5,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 6, y: 7, type: 'farm', state: 'destroyed'},
            {
                x: 5,
                y: 7,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 9, y: 2, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 10,
                y: 3,
                type: 'farm',
                state: 'normal',
                ownerId: 0
            },
            {x: 1, y: 1, type: 'castle', state: 'normal', ownerId: 1},
            {
                x: 1,
                y: 3,
                type: 'farm',
                state: 'normal',
                ownerId: 1
            },
            {x: 10, y: 11, type: 'castle', state: 'normal', ownerId: 2},
            {
                x: 10,
                y: 9,
                type: 'farm',
                state: 'normal',
                ownerId: 2
            },
            {x: 1, y: 9, type: 'farm', state: 'normal', ownerId: 3},
            {
                x: 2,
                y: 10,
                type: 'castle',
                state: 'normal',
                ownerId: 3
            }
        ],
        terrain: {
            x0y0: 'road-1',
            x0y1: 'road-1',
            x0y2: 'road-1',
            x0y3: 'road-1',
            x0y4: 'road-1',
            x0y5: 'stone-1',
            x0y6: 'terra-1',
            x0y7: 'stone-1',
            x0y8: 'road-1',
            x0y9: 'road-1',
            x0y10: 'road-1',
            x1y0: 'road-1',
            x1y1: 'road-1',
            x1y2: 'terra-1',
            x1y3: 'terra-1',
            x1y4: 'road-1',
            x1y5: 'hill-1',
            x1y6: 'stone-1',
            x1y7: 'forest-2',
            x1y8: 'road-1',
            x1y9: 'terra-1',
            x1y10: 'hill-1',
            x2y0: 'road-1',
            x2y1: 'terra-1',
            x2y2: 'forest-2',
            x2y3: 'hill-1',
            x2y4: 'road-1',
            x2y5: 'road-1',
            x2y6: 'road-1',
            x2y7: 'road-1',
            x2y8: 'road-1',
            x2y9: 'forest-2',
            x2y10: 'road-1',
            x3y0: 'road-1',
            x3y1: 'forest-1',
            x3y2: 'forest-1',
            x3y3: 'stone-1',
            x3y4: 'road-1',
            x3y5: 'terra-1',
            x3y6: 'road-1',
            x3y7: 'stone-1',
            x3y8: 'road-1',
            x3y9: 'stone-1',
            x3y10: 'forest-2',
            x4y0: 'road-1',
            x4y1: 'road-1',
            x4y2: 'road-1',
            x4y3: 'road-1',
            x4y4: 'road-1',
            x4y5: 'stone-1',
            x4y6: 'road-1',
            x4y7: 'stone-1',
            x4y8: 'road-1',
            x4y9: 'road-1',
            x4y10: 'road-1',
            x5y0: 'water-1',
            x5y1: 'water-1',
            x5y2: 'bridge-1',
            x5y3: 'terra-1',
            x5y4: 'stone-1',
            x5y5: 'terra-1',
            x5y6: 'road-1',
            x5y7: 'terra-1',
            x5y8: 'stone-1',
            x5y9: 'forest-2',
            x5y10: 'bridge-1',
            x6y0: 'water-1',
            x6y1: 'water-1',
            x6y2: 'bridge-1',
            x6y3: 'forest-2',
            x6y4: 'stone-1',
            x6y5: 'terra-1',
            x6y6: 'road-1',
            x6y7: 'terra-1',
            x6y8: 'stone-1',
            x6y9: 'terra-1',
            x6y10: 'bridge-1',
            x7y0: 'road-1',
            x7y1: 'road-1',
            x7y2: 'road-1',
            x7y3: 'road-1',
            x7y4: 'road-1',
            x7y5: 'stone-1',
            x7y6: 'road-1',
            x7y7: 'stone-1',
            x7y8: 'road-1',
            x7y9: 'road-1',
            x7y10: 'road-1',
            x8y0: 'road-1',
            x8y1: 'terra-1',
            x8y2: 'forest-2',
            x8y3: 'terra-1',
            x8y4: 'road-1',
            x8y5: 'stone-1',
            x8y6: 'road-1',
            x8y7: 'terra-1',
            x8y8: 'road-1',
            x8y9: 'stone-1',
            x8y10: 'forest-1',
            x9y0: 'road-1',
            x9y1: 'forest-1',
            x9y2: 'road-1',
            x9y3: 'forest-2',
            x9y4: 'road-1',
            x9y5: 'road-1',
            x9y6: 'road-1',
            x9y7: 'road-1',
            x9y8: 'road-1',
            x9y9: 'hill-1',
            x9y10: 'forest-2',
            x10y0: 'road-1',
            x10y1: 'terra-1',
            x10y2: 'hill-1',
            x10y3: 'terra-1',
            x10y4: 'road-1',
            x10y5: 'forest-2',
            x10y6: 'stone-1',
            x10y7: 'hill-1',
            x10y8: 'road-1',
            x10y9: 'terra-1',
            x10y10: 'terra-1',
            x11y0: 'road-1',
            x11y1: 'road-1',
            x11y2: 'road-1',
            x11y3: 'road-1',
            x11y4: 'road-1',
            x11y5: 'stone-1',
            x11y6: 'terra-1',
            x11y7: 'stone-1',
            x11y8: 'road-1',
            x11y9: 'road-1',
            x11y10: 'road-1',
            x0y11: 'road-1',
            x1y11: 'terra-1',
            x2y11: 'forest-1',
            x3y11: 'terra-1',
            x4y11: 'road-1',
            x5y11: 'water-1',
            x6y11: 'water-1',
            x7y11: 'road-1',
            x8y11: 'forest-1',
            x9y11: 'terra-1',
            x10y11: 'road-1',
            x11y11: 'road-1',
            x0y12: 'road-1',
            x1y12: 'road-1',
            x2y12: 'road-1',
            x3y12: 'road-1',
            x4y12: 'road-1',
            x5y12: 'water-1',
            x6y12: 'water-1',
            x7y12: 'road-1',
            x8y12: 'road-1',
            x9y12: 'road-1',
            x10y12: 'road-1',
            x11y12: 'road-1'
        }
    };
})(window);
