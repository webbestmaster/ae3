/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_030 = {
        version: 1,
        type: 'skirmish',
        size: {width: 13, height: 13},
        name: 'Swords',
        'name-es': 'Espadas',
        'name-ru': 'Шпаги',
        isOpen: true,
        maxPlayers: 2,
        units: [
            {x: 4, y: 4, type: 'commander', ownerId: 0},
            {
                x: 4,
                y: 5,
                type: 'golem',
                ownerId: 0
            },
            {x: 5, y: 4, type: 'golem', ownerId: 0},
            {
                x: 8,
                y: 8,
                type: 'commander',
                ownerId: 1
            },
            {x: 8, y: 7, type: 'golem', ownerId: 1},
            {x: 7, y: 8, type: 'golem', ownerId: 1}
        ],
        buildings: [
            {x: 6, y: 4, type: 'farm', state: 'normal'},
            {
                x: 8,
                y: 4,
                type: 'farm',
                state: 'normal'
            },
            {x: 8, y: 6, type: 'farm', state: 'normal'},
            {
                x: 6,
                y: 6,
                type: 'farm',
                state: 'normal'
            },
            {x: 4, y: 6, type: 'farm', state: 'normal'},
            {
                x: 4,
                y: 8,
                type: 'farm',
                state: 'normal'
            },
            {x: 6, y: 8, type: 'farm', state: 'normal'},
            {
                x: 4,
                y: 4,
                type: 'castle',
                state: 'normal',
                ownerId: 0
            },
            {x: 8, y: 8, type: 'castle', state: 'normal', ownerId: 1}
        ],
        terrain: {
            x0y0: 'water-1',
            x0y1: 'water-1',
            x0y2: 'water-1',
            x0y3: 'water-1',
            x0y4: 'water-1',
            x0y5: 'water-2',
            x0y6: 'water-1',
            x0y7: 'water-1',
            x0y8: 'water-1',
            x0y9: 'water-1',
            x0y10: 'water-1',
            x1y0: 'water-1',
            x1y1: 'water-1',
            x1y2: 'water-1',
            x1y3: 'water-3',
            x1y4: 'water-1',
            x1y5: 'water-1',
            x1y6: 'water-1',
            x1y7: 'water-1',
            x1y8: 'water-1',
            x1y9: 'water-1',
            x1y10: 'forest-1',
            x2y0: 'water-3',
            x2y1: 'water-1',
            x2y2: 'water-1',
            x2y3: 'water-1',
            x2y4: 'water-1',
            x2y5: 'water-1',
            x2y6: 'water-1',
            x2y7: 'water-1',
            x2y8: 'water-2',
            x2y9: 'water-1',
            x2y10: 'water-1',
            x3y0: 'water-1',
            x3y1: 'water-3',
            x3y2: 'water-1',
            x3y3: 'stone-1',
            x3y4: 'stone-1',
            x3y5: 'hill-1',
            x3y6: 'forest-2',
            x3y7: 'water-1',
            x3y8: 'water-1',
            x3y9: 'water-1',
            x3y10: 'water-1',
            x4y0: 'water-1',
            x4y1: 'water-1',
            x4y2: 'water-1',
            x4y3: 'forest-2',
            x4y4: 'road-1',
            x4y5: 'terra-1',
            x4y6: 'terra-1',
            x4y7: 'forest-2',
            x4y8: 'terra-1',
            x4y9: 'water-1',
            x4y10: 'water-1',
            x5y0: 'water-1',
            x5y1: 'water-1',
            x5y2: 'water-1',
            x5y3: 'forest-1',
            x5y4: 'terra-1',
            x5y5: 'road-1',
            x5y6: 'road-1',
            x5y7: 'road-1',
            x5y8: 'stone-1',
            x5y9: 'water-1',
            x5y10: 'water-1',
            x6y0: 'water-2',
            x6y1: 'water-1',
            x6y2: 'water-1',
            x6y3: 'forest-1',
            x6y4: 'terra-1',
            x6y5: 'road-1',
            x6y6: 'terra-1',
            x6y7: 'road-1',
            x6y8: 'terra-1',
            x6y9: 'forest-1',
            x6y10: 'water-1',
            x7y0: 'water-1',
            x7y1: 'water-1',
            x7y2: 'water-1',
            x7y3: 'water-1',
            x7y4: 'stone-1',
            x7y5: 'road-1',
            x7y6: 'road-1',
            x7y7: 'road-1',
            x7y8: 'terra-1',
            x7y9: 'forest-2',
            x7y10: 'water-1',
            x8y0: 'water-1',
            x8y1: 'water-1',
            x8y2: 'water-1',
            x8y3: 'water-1',
            x8y4: 'terra-1',
            x8y5: 'forest-1',
            x8y6: 'terra-1',
            x8y7: 'terra-1',
            x8y8: 'road-1',
            x8y9: 'forest-1',
            x8y10: 'water-1',
            x9y0: 'water-2',
            x9y1: 'water-1',
            x9y2: 'water-1',
            x9y3: 'water-1',
            x9y4: 'water-1',
            x9y5: 'water-1',
            x9y6: 'forest-1',
            x9y7: 'hill-1',
            x9y8: 'stone-1',
            x9y9: 'stone-1',
            x9y10: 'water-1',
            x10y0: 'water-1',
            x10y1: 'water-1',
            x10y2: 'water-1',
            x10y3: 'water-1',
            x10y4: 'water-1',
            x10y5: 'water-1',
            x10y6: 'water-1',
            x10y7: 'water-1',
            x10y8: 'water-1',
            x10y9: 'water-1',
            x10y10: 'water-1',
            x0y11: 'water-1',
            x1y11: 'water-1',
            x2y11: 'water-1',
            x3y11: 'water-3',
            x4y11: 'water-1',
            x5y11: 'water-1',
            x6y11: 'water-1',
            x7y11: 'water-1',
            x8y11: 'water-1',
            x9y11: 'water-1',
            x10y11: 'water-1',
            x0y12: 'water-1',
            x1y12: 'water-1',
            x2y12: 'water-2',
            x3y12: 'water-1',
            x4y12: 'water-1',
            x5y12: 'water-1',
            x6y12: 'water-1',
            x7y12: 'water-1',
            x8y12: 'water-3',
            x9y12: 'water-1',
            x10y12: 'water-1',
            x11y0: 'water-1',
            x11y1: 'stone-1',
            x11y2: 'water-1',
            x11y3: 'water-1',
            x11y4: 'water-3',
            x11y5: 'water-1',
            x11y6: 'water-1',
            x11y7: 'water-1',
            x11y8: 'water-1',
            x11y9: 'water-1',
            x11y10: 'water-2',
            x11y11: 'water-1',
            x11y12: 'water-1',
            x12y0: 'water-1',
            x12y1: 'water-1',
            x12y2: 'water-1',
            x12y3: 'water-1',
            x12y4: 'water-1',
            x12y5: 'water-3',
            x12y6: 'water-1',
            x12y7: 'water-1',
            x12y8: 'water-1',
            x12y9: 'water-1',
            x12y10: 'water-1',
            x12y11: 'water-2',
            x12y12: 'water-2'
        }
    };
})(window);
