/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_063 = {
        type: 'skirmish',
        size: {width: 17, height: 17},
        name: 'Quick end',
        'name-es': 'Final rápida',
        'name-ru': 'Быстрый конец',
        isOpen: true,
        maxPlayers: 4,
        units: [
            {x: 4, y: 6, type: 'commander', ownerId: 0},
            {x: 11, y: 10, type: 'commander', ownerId: 1},
            {x: 11, y: 6, type: 'commander', ownerId: 2},
            {x: 4, y: 10, type: 'commander', ownerId: 3}
        ],
        buildings: [
            {x: 2, y: 0, type: 'farm', state: 'destroyed'},
            {x: 1, y: 0, type: 'farm', state: 'destroyed'},
            {x: 0, y: 0, type: 'farm', state: 'destroyed'},
            {x: 0, y: 1, type: 'farm', state: 'destroyed'},
            {x: 0, y: 2, type: 'farm', state: 'destroyed'},
            {x: 14, y: 0, type: 'farm', state: 'destroyed'},
            {x: 15, y: 0, type: 'farm', state: 'destroyed'},
            {x: 16, y: 0, type: 'farm', state: 'destroyed'},
            {x: 16, y: 1, type: 'farm', state: 'destroyed'},
            {x: 16, y: 2, type: 'farm', state: 'destroyed'},
            {x: 16, y: 14, type: 'farm', state: 'destroyed'},
            {x: 16, y: 15, type: 'farm', state: 'destroyed'},
            {x: 16, y: 16, type: 'farm', state: 'destroyed'},
            {x: 15, y: 16, type: 'farm', state: 'destroyed'},
            {x: 14, y: 16, type: 'farm', state: 'destroyed'},
            {x: 2, y: 16, type: 'farm', state: 'destroyed'},
            {x: 1, y: 16, type: 'farm', state: 'destroyed'},
            {x: 0, y: 16, type: 'farm', state: 'destroyed'},
            {x: 0, y: 15, type: 'farm', state: 'destroyed'},
            {x: 0, y: 14, type: 'farm', state: 'destroyed'},
            {
                x: 5,
                y: 6,
                type: 'farm',
                state: 'normal'
            },
            {x: 4, y: 7, type: 'farm', state: 'normal'},
            {x: 4, y: 9, type: 'farm', state: 'normal'},
            {x: 5, y: 10, type: 'farm', state: 'normal'},
            {x: 10, y: 10, type: 'farm', state: 'normal'},
            {x: 11, y: 9, type: 'farm', state: 'normal'},
            {x: 11, y: 7, type: 'farm', state: 'normal'},
            {x: 10, y: 6, type: 'farm', state: 'normal'},
            {x: 15, y: 1, type: 'well', state: 'normal'},
            {x: 14, y: 2, type: 'well', state: 'normal'},
            {x: 14, y: 14, type: 'well', state: 'normal'},
            {x: 15, y: 15, type: 'well', state: 'normal'},
            {x: 1, y: 15, type: 'well', state: 'normal'},
            {x: 2, y: 14, type: 'well', state: 'normal'},
            {x: 1, y: 1, type: 'well', state: 'normal'},
            {x: 2, y: 2, type: 'well', state: 'normal'},
            {x: 7, y: 8, type: 'well', state: 'normal'},
            {x: 8, y: 8, type: 'well', state: 'normal'},
            {x: 4, y: 6, type: 'castle', state: 'normal', ownerId: 0},
            {x: 11, y: 6, type: 'castle', state: 'normal', ownerId: 2},
            {x: 11, y: 10, type: 'castle', state: 'normal', ownerId: 1},
            {
                x: 4,
                y: 10,
                type: 'castle',
                state: 'normal',
                ownerId: 3
            }
        ],
        terrain: {
            x0y6: 'water-1',
            x0y7: 'water-1',
            x0y8: 'bridge-1',
            x0y9: 'water-1',
            x0y10: 'water-1',
            x0y11: 'water-1',
            x0y12: 'water-1',
            x0y13: 'water-1',
            x0y14: 'terra-1',
            x0y15: 'terra-1',
            x0y16: 'terra-1',
            x1y6: 'water-1',
            x1y7: 'water-1',
            x1y8: 'bridge-1',
            x1y9: 'water-1',
            x1y10: 'water-1',
            x1y11: 'water-1',
            x1y12: 'water-1',
            x1y13: 'water-1',
            x1y14: 'forest-1',
            x1y15: 'road-1',
            x1y16: 'terra-1',
            x2y6: 'water-1',
            x2y7: 'water-1',
            x2y8: 'bridge-1',
            x2y9: 'water-1',
            x2y10: 'water-1',
            x2y11: 'water-1',
            x2y12: 'water-1',
            x2y13: 'water-1',
            x2y14: 'road-1',
            x2y15: 'forest-1',
            x2y16: 'terra-1',
            x3y6: 'water-1',
            x3y7: 'water-1',
            x3y8: 'bridge-1',
            x3y9: 'water-1',
            x3y10: 'water-1',
            x3y11: 'water-1',
            x3y12: 'water-1',
            x3y13: 'water-1',
            x3y14: 'water-1',
            x3y15: 'water-1',
            x3y16: 'water-1',
            x4y6: 'road-1',
            x4y7: 'terra-1',
            x4y8: 'terra-1',
            x4y9: 'terra-1',
            x4y10: 'road-1',
            x4y11: 'water-1',
            x4y12: 'water-1',
            x4y13: 'water-1',
            x4y14: 'water-1',
            x4y15: 'water-1',
            x4y16: 'water-1',
            x5y6: 'terra-1',
            x5y7: 'terra-1',
            x5y8: 'terra-1',
            x5y9: 'terra-1',
            x5y10: 'terra-1',
            x5y11: 'water-1',
            x5y12: 'water-1',
            x5y13: 'water-1',
            x5y14: 'water-1',
            x5y15: 'water-1',
            x5y16: 'water-1',
            x6y6: 'stone-1',
            x6y7: 'terra-1',
            x6y8: 'terra-1',
            x6y9: 'terra-1',
            x6y10: 'stone-1',
            x6y11: 'water-1',
            x6y12: 'water-1',
            x6y13: 'water-1',
            x6y14: 'water-1',
            x6y15: 'water-1',
            x6y16: 'water-1',
            x7y6: 'terra-1',
            x7y7: 'terra-1',
            x7y8: 'road-1',
            x7y9: 'terra-1',
            x7y10: 'terra-1',
            x7y11: 'bridge-2',
            x7y12: 'bridge-2',
            x7y13: 'bridge-2',
            x7y14: 'bridge-2',
            x7y15: 'bridge-2',
            x7y16: 'bridge-2',
            x8y6: 'terra-1',
            x8y7: 'terra-1',
            x8y8: 'road-1',
            x8y9: 'terra-1',
            x8y10: 'terra-1',
            x8y11: 'bridge-2',
            x8y12: 'bridge-2',
            x8y13: 'bridge-2',
            x8y14: 'bridge-2',
            x8y15: 'bridge-2',
            x8y16: 'bridge-2',
            x9y6: 'stone-1',
            x9y7: 'terra-1',
            x9y8: 'terra-1',
            x9y9: 'terra-1',
            x9y10: 'stone-1',
            x9y11: 'water-1',
            x9y12: 'water-1',
            x9y13: 'water-1',
            x9y14: 'water-1',
            x9y15: 'water-1',
            x9y16: 'water-1',
            x10y6: 'terra-1',
            x10y7: 'terra-1',
            x10y8: 'terra-1',
            x10y9: 'terra-1',
            x10y10: 'terra-1',
            x10y11: 'water-1',
            x10y12: 'water-1',
            x10y13: 'water-1',
            x10y14: 'water-1',
            x10y15: 'water-1',
            x10y16: 'water-1',
            x11y6: 'road-1',
            x11y7: 'terra-1',
            x11y8: 'terra-1',
            x11y9: 'terra-1',
            x11y10: 'road-1',
            x11y11: 'water-1',
            x11y12: 'water-1',
            x11y13: 'water-1',
            x11y14: 'water-1',
            x11y15: 'water-1',
            x11y16: 'water-1',
            x12y6: 'water-1',
            x12y7: 'water-1',
            x12y8: 'bridge-1',
            x12y9: 'water-1',
            x12y10: 'water-1',
            x12y11: 'water-1',
            x12y12: 'water-1',
            x12y13: 'water-1',
            x12y14: 'water-1',
            x12y15: 'water-1',
            x12y16: 'water-1',
            x13y6: 'water-1',
            x13y7: 'water-1',
            x13y8: 'bridge-1',
            x13y9: 'water-1',
            x13y10: 'water-1',
            x13y11: 'water-1',
            x13y12: 'water-1',
            x13y13: 'water-1',
            x13y14: 'water-1',
            x13y15: 'water-1',
            x13y16: 'water-1',
            x14y6: 'water-1',
            x14y7: 'water-1',
            x14y8: 'bridge-1',
            x14y9: 'water-1',
            x14y10: 'water-1',
            x14y11: 'water-1',
            x14y12: 'water-1',
            x14y13: 'water-1',
            x14y14: 'road-1',
            x14y15: 'forest-1',
            x14y16: 'terra-1',
            x15y6: 'water-1',
            x15y7: 'water-1',
            x15y8: 'bridge-1',
            x15y9: 'water-1',
            x15y10: 'water-1',
            x15y11: 'water-1',
            x15y12: 'water-1',
            x15y13: 'water-1',
            x15y14: 'forest-1',
            x15y15: 'road-1',
            x15y16: 'terra-1',
            x0y5: 'water-1',
            x1y5: 'water-1',
            x2y5: 'water-1',
            x3y5: 'water-1',
            x4y5: 'water-1',
            x5y5: 'water-1',
            x6y5: 'water-1',
            x7y5: 'bridge-2',
            x8y5: 'bridge-2',
            x9y5: 'water-1',
            x10y5: 'water-1',
            x11y5: 'water-1',
            x12y5: 'water-1',
            x13y5: 'water-1',
            x14y5: 'water-1',
            x15y5: 'water-1',
            x0y4: 'water-1',
            x1y4: 'water-1',
            x2y4: 'water-1',
            x3y4: 'water-1',
            x4y4: 'water-1',
            x5y4: 'water-1',
            x6y4: 'water-1',
            x7y4: 'bridge-2',
            x8y4: 'bridge-2',
            x9y4: 'water-1',
            x10y4: 'water-1',
            x11y4: 'water-1',
            x12y4: 'water-1',
            x13y4: 'water-1',
            x14y4: 'water-1',
            x15y4: 'water-1',
            x0y3: 'water-1',
            x1y3: 'water-1',
            x2y3: 'water-1',
            x3y3: 'water-1',
            x4y3: 'water-1',
            x5y3: 'water-1',
            x6y3: 'water-1',
            x7y3: 'bridge-2',
            x8y3: 'bridge-2',
            x9y3: 'water-1',
            x10y3: 'water-1',
            x11y3: 'water-1',
            x12y3: 'water-1',
            x13y3: 'water-1',
            x14y3: 'water-1',
            x15y3: 'water-1',
            x0y2: 'terra-1',
            x1y2: 'forest-1',
            x2y2: 'road-1',
            x3y2: 'water-1',
            x4y2: 'water-1',
            x5y2: 'water-1',
            x6y2: 'water-1',
            x7y2: 'bridge-2',
            x8y2: 'bridge-2',
            x9y2: 'water-1',
            x10y2: 'water-1',
            x11y2: 'water-1',
            x12y2: 'water-1',
            x13y2: 'water-1',
            x14y2: 'road-1',
            x15y2: 'forest-1',
            x0y1: 'terra-1',
            x1y1: 'road-1',
            x2y1: 'forest-1',
            x3y1: 'water-1',
            x4y1: 'water-1',
            x5y1: 'water-1',
            x6y1: 'water-1',
            x7y1: 'bridge-2',
            x8y1: 'bridge-2',
            x9y1: 'water-1',
            x10y1: 'water-1',
            x11y1: 'water-1',
            x12y1: 'water-1',
            x13y1: 'water-1',
            x14y1: 'forest-1',
            x15y1: 'road-1',
            x0y0: 'terra-1',
            x1y0: 'terra-1',
            x2y0: 'terra-1',
            x3y0: 'water-1',
            x4y0: 'water-1',
            x5y0: 'water-1',
            x6y0: 'water-1',
            x7y0: 'bridge-2',
            x8y0: 'bridge-2',
            x9y0: 'water-1',
            x10y0: 'water-1',
            x11y0: 'water-1',
            x12y0: 'water-1',
            x13y0: 'water-1',
            x14y0: 'terra-1',
            x15y0: 'terra-1',
            x16y0: 'terra-1',
            x16y1: 'terra-1',
            x16y2: 'terra-1',
            x16y3: 'water-1',
            x16y4: 'water-1',
            x16y5: 'water-1',
            x16y6: 'water-1',
            x16y7: 'water-1',
            x16y8: 'bridge-1',
            x16y9: 'water-1',
            x16y10: 'water-1',
            x16y11: 'water-1',
            x16y12: 'water-1',
            x16y13: 'water-1',
            x16y14: 'terra-1',
            x16y15: 'terra-1',
            x16y16: 'terra-1'
        }
    };
})(window);
