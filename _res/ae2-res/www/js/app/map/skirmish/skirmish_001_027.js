/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_027 = {
        version: 1,
        type: 'skirmish',
        size: {width: 12, height: 12},
        name: 'Accuracy',
        'name-es': 'Exactitud',
        'name-ru': 'Точность',
        isOpen: true,
        maxPlayers: 2,
        units: [
            {x: 6, y: 3, type: 'catapult', ownerId: 0},
            {
                x: 6,
                y: 8,
                type: 'catapult',
                ownerId: 0
            },
            {x: 5, y: 3, type: 'catapult', ownerId: 1},
            {
                x: 5,
                y: 8,
                type: 'catapult',
                ownerId: 1
            },
            {x: 0, y: 6, type: 'commander', ownerId: 0},
            {x: 11, y: 5, type: 'commander', ownerId: 1}
        ],
        buildings: [
            {x: 7, y: 4, type: 'farm', state: 'normal'},
            {
                x: 7,
                y: 5,
                type: 'farm',
                state: 'normal'
            },
            {x: 7, y: 6, type: 'farm', state: 'normal'},
            {
                x: 7,
                y: 7,
                type: 'farm',
                state: 'normal'
            },
            {x: 8, y: 6, type: 'farm', state: 'normal'},
            {
                x: 8,
                y: 5,
                type: 'farm',
                state: 'normal'
            },
            {x: 4, y: 4, type: 'farm', state: 'normal'},
            {
                x: 4,
                y: 5,
                type: 'farm',
                state: 'normal'
            },
            {x: 4, y: 6, type: 'farm', state: 'normal'},
            {
                x: 4,
                y: 7,
                type: 'farm',
                state: 'normal'
            },
            {x: 3, y: 6, type: 'farm', state: 'normal'},
            {
                x: 3,
                y: 5,
                type: 'farm',
                state: 'normal'
            },
            {x: 5, y: 3, type: 'well', state: 'normal'},
            {
                x: 6,
                y: 3,
                type: 'well',
                state: 'normal'
            },
            {x: 5, y: 8, type: 'well', state: 'normal'},
            {
                x: 6,
                y: 8,
                type: 'well',
                state: 'normal'
            },
            {x: 4, y: 11, type: 'farm', state: 'destroyed'},
            {
                x: 7,
                y: 11,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 4, y: 0, type: 'farm', state: 'destroyed'},
            {
                x: 7,
                y: 0,
                type: 'farm',
                state: 'destroyed'
            },
            {x: 3, y: 0, type: 'castle', state: 'normal'},
            {
                x: 8,
                y: 0,
                type: 'castle',
                state: 'normal'
            },
            {x: 8, y: 11, type: 'castle', state: 'normal'},
            {
                x: 3,
                y: 11,
                type: 'castle',
                state: 'normal'
            },
            {x: 0, y: 6, type: 'castle', state: 'normal', ownerId: 0},
            {
                x: 11,
                y: 5,
                type: 'castle',
                state: 'normal',
                ownerId: 1
            }
        ],
        terrain: {
            x0y0: 'water-1',
            x0y1: 'water-1',
            x0y2: 'water-1',
            x0y3: 'hill-1',
            x0y4: 'terra-1',
            x0y5: 'terra-1',
            x0y6: 'road-1',
            x0y7: 'terra-1',
            x0y8: 'forest-1',
            x0y9: 'water-1',
            x0y10: 'water-1',
            x1y0: 'water-1',
            x1y1: 'water-2',
            x1y2: 'water-1',
            x1y3: 'water-1',
            x1y4: 'forest-2',
            x1y5: 'terra-1',
            x1y6: 'road-1',
            x1y7: 'hill-1',
            x1y8: 'water-1',
            x1y9: 'water-1',
            x1y10: 'water-1',
            x2y0: 'water-1',
            x2y1: 'water-1',
            x2y2: 'water-1',
            x2y3: 'water-1',
            x2y4: 'road-1',
            x2y5: 'road-1',
            x2y6: 'road-1',
            x2y7: 'road-1',
            x2y8: 'water-1',
            x2y9: 'water-1',
            x2y10: 'water-1',
            x3y0: 'road-1',
            x3y1: 'road-1',
            x3y2: 'road-1',
            x3y3: 'road-1',
            x3y4: 'road-1',
            x3y5: 'terra-1',
            x3y6: 'terra-1',
            x3y7: 'road-1',
            x3y8: 'road-1',
            x3y9: 'road-1',
            x3y10: 'road-1',
            x4y0: 'terra-1',
            x4y1: 'stone-1',
            x4y2: 'terra-1',
            x4y3: 'terra-1',
            x4y4: 'terra-1',
            x4y5: 'terra-1',
            x4y6: 'terra-1',
            x4y7: 'terra-1',
            x4y8: 'terra-1',
            x4y9: 'forest-2',
            x4y10: 'stone-1',
            x5y0: 'water-1',
            x5y1: 'water-1',
            x5y2: 'water-1',
            x5y3: 'road-1',
            x5y4: 'water-1',
            x5y5: 'water-1',
            x5y6: 'water-1',
            x5y7: 'water-1',
            x5y8: 'road-1',
            x5y9: 'water-1',
            x5y10: 'water-1',
            x6y0: 'water-1',
            x6y1: 'water-1',
            x6y2: 'water-1',
            x6y3: 'road-1',
            x6y4: 'water-1',
            x6y5: 'water-1',
            x6y6: 'water-1',
            x6y7: 'water-1',
            x6y8: 'road-1',
            x6y9: 'water-1',
            x6y10: 'water-1',
            x7y0: 'terra-1',
            x7y1: 'stone-1',
            x7y2: 'hill-1',
            x7y3: 'terra-1',
            x7y4: 'terra-1',
            x7y5: 'terra-1',
            x7y6: 'terra-1',
            x7y7: 'terra-1',
            x7y8: 'terra-1',
            x7y9: 'terra-4',
            x7y10: 'stone-1',
            x8y0: 'road-1',
            x8y1: 'road-1',
            x8y2: 'road-1',
            x8y3: 'road-1',
            x8y4: 'road-1',
            x8y5: 'terra-1',
            x8y6: 'terra-1',
            x8y7: 'road-1',
            x8y8: 'road-1',
            x8y9: 'road-1',
            x8y10: 'road-1',
            x9y0: 'water-1',
            x9y1: 'water-1',
            x9y2: 'water-1',
            x9y3: 'water-1',
            x9y4: 'road-1',
            x9y5: 'road-1',
            x9y6: 'road-1',
            x9y7: 'road-1',
            x9y8: 'water-1',
            x9y9: 'water-1',
            x9y10: 'water-1',
            x10y0: 'water-1',
            x10y1: 'water-1',
            x10y2: 'water-1',
            x10y3: 'water-1',
            x10y4: 'forest-1',
            x10y5: 'road-1',
            x10y6: 'terra-1',
            x10y7: 'terra-2',
            x10y8: 'water-1',
            x10y9: 'water-1',
            x10y10: 'water-2',
            x11y0: 'water-2',
            x11y1: 'water-1',
            x11y2: 'water-1',
            x11y3: 'terra-5',
            x11y4: 'terra-1',
            x11y5: 'road-1',
            x11y6: 'terra-1',
            x11y7: 'terra-1',
            x11y8: 'forest-2',
            x11y9: 'water-1',
            x11y10: 'water-1',
            x0y11: 'water-2',
            x1y11: 'water-1',
            x2y11: 'water-1',
            x3y11: 'road-1',
            x4y11: 'terra-1',
            x5y11: 'water-1',
            x6y11: 'water-1',
            x7y11: 'terra-1',
            x8y11: 'road-1',
            x9y11: 'water-1',
            x10y11: 'water-1',
            x11y11: 'water-1'
        }
    };
})(window);
