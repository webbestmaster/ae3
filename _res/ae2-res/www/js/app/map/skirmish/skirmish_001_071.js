/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_071 = {
        type: 'skirmish',
        size: {width: 16, height: 15},
        name: 'Cycle 2',
        'name-es': 'Ciclo 2',
        'name-ru': 'Круговорот 2',
        isOpen: true,
        maxPlayers: 4,
        units: [
            {x: 7, y: 1, type: 'commander', ownerId: 0},
            {x: 14, y: 7, type: 'commander', ownerId: 2},
            {x: 1, y: 7, type: 'commander', ownerId: 1},
            {x: 7, y: 13, type: 'commander', ownerId: 3}
        ],
        buildings: [
            {x: 0, y: 0, type: 'farm', state: 'normal'},
            {x: 0, y: 14, type: 'farm', state: 'normal'},
            {x: 1, y: 5, type: 'farm', state: 'normal'},
            {x: 1, y: 7, type: 'castle', state: 'normal', ownerId: 1},
            {x: 1, y: 9, type: 'farm', state: 'normal'},
            {x: 3, y: 7, type: 'well', state: 'normal'},
            {x: 5, y: 1, type: 'farm', state: 'normal'},
            {x: 5, y: 13, type: 'farm', state: 'normal'},
            {x: 7, y: 1, type: 'castle', state: 'normal', ownerId: 0},
            {x: 7, y: 3, type: 'well', state: 'normal'},
            {x: 7, y: 11, type: 'well', state: 'normal'},
            {x: 7, y: 13, type: 'castle', state: 'normal', ownerId: 3},
            {x: 9, y: 1, type: 'farm', state: 'normal'},
            {x: 9, y: 13, type: 'farm', state: 'normal'},
            {x: 12, y: 7, type: 'well', state: 'normal'},
            {x: 14, y: 5, type: 'farm', state: 'normal'},
            {x: 14, y: 7, type: 'castle', state: 'normal', ownerId: 2},
            {x: 14, y: 9, type: 'farm', state: 'normal'},
            {x: 15, y: 0, type: 'farm', state: 'normal'},
            {x: 15, y: 14, type: 'farm', state: 'normal'}
        ],
        terrain: {
            x0y0: 'terra-1',
            x0y1: 'stone-1',
            x0y2: 'terra-1',
            x0y3: 'terra-1',
            x0y4: 'stone-1',
            x0y5: 'stone-1',
            x0y6: 'stone-1',
            x0y7: 'stone-1',
            x0y8: 'stone-1',
            x0y9: 'stone-1',
            x0y10: 'stone-1',
            x0y11: 'terra-1',
            x0y12: 'terra-1',
            x0y13: 'stone-1',
            x0y14: 'terra-1',
            x1y0: 'stone-1',
            x1y1: 'forest-1',
            x1y2: 'terra-1',
            x1y3: 'terra-1',
            x1y4: 'stone-1',
            x1y5: 'terra-1',
            x1y6: 'stone-1',
            x1y7: 'road-1',
            x1y8: 'stone-1',
            x1y9: 'terra-1',
            x1y10: 'stone-1',
            x1y11: 'terra-1',
            x1y12: 'terra-1',
            x1y13: 'forest-1',
            x1y14: 'stone-1',
            x2y0: 'terra-1',
            x2y1: 'terra-1',
            x2y2: 'road-1',
            x2y3: 'road-1',
            x2y4: 'road-1',
            x2y5: 'road-1',
            x2y6: 'road-1',
            x2y7: 'road-1',
            x2y8: 'road-1',
            x2y9: 'road-1',
            x2y10: 'road-1',
            x2y11: 'road-1',
            x2y12: 'road-1',
            x2y13: 'terra-1',
            x2y14: 'terra-1',
            x3y0: 'terra-1',
            x3y1: 'terra-1',
            x3y2: 'road-1',
            x3y3: 'forest-2',
            x3y4: 'terra-1',
            x3y5: 'terra-1',
            x3y6: 'hill-1',
            x3y7: 'road-1',
            x3y8: 'hill-1',
            x3y9: 'terra-1',
            x3y10: 'terra-1',
            x3y11: 'forest-2',
            x3y12: 'road-1',
            x3y13: 'terra-1',
            x3y14: 'terra-1',
            x4y0: 'stone-1',
            x4y1: 'stone-1',
            x4y2: 'road-1',
            x4y3: 'terra-1',
            x4y4: 'water-1',
            x4y5: 'water-1',
            x4y6: 'water-1',
            x4y7: 'water-1',
            x4y8: 'water-1',
            x4y9: 'water-1',
            x4y10: 'water-1',
            x4y11: 'terra-1',
            x4y12: 'road-1',
            x4y13: 'stone-1',
            x4y14: 'stone-1',
            x5y0: 'stone-1',
            x5y1: 'terra-1',
            x5y2: 'road-1',
            x5y3: 'terra-1',
            x5y4: 'water-1',
            x5y5: 'water-1',
            x5y6: 'water-1',
            x5y7: 'water-1',
            x5y8: 'water-1',
            x5y9: 'water-2',
            x5y10: 'water-1',
            x5y11: 'terra-1',
            x5y12: 'road-1',
            x5y13: 'terra-1',
            x5y14: 'stone-1',
            x6y0: 'stone-1',
            x6y1: 'stone-1',
            x6y2: 'road-1',
            x6y3: 'hill-1',
            x6y4: 'water-1',
            x6y5: 'water-1',
            x6y6: 'water-2',
            x6y7: 'water-1',
            x6y8: 'water-1',
            x6y9: 'water-1',
            x6y10: 'water-1',
            x6y11: 'hill-1',
            x6y12: 'road-1',
            x6y13: 'stone-1',
            x6y14: 'stone-1',
            x7y0: 'stone-1',
            x7y1: 'road-1',
            x7y2: 'road-1',
            x7y3: 'road-1',
            x7y4: 'water-1',
            x7y5: 'water-1',
            x7y6: 'water-1',
            x7y7: 'water-1',
            x7y8: 'water-1',
            x7y9: 'water-1',
            x7y10: 'water-1',
            x7y11: 'road-1',
            x7y12: 'road-1',
            x7y13: 'road-1',
            x7y14: 'stone-1',
            x8y0: 'stone-1',
            x8y1: 'stone-1',
            x8y2: 'road-1',
            x8y3: 'hill-1',
            x8y4: 'water-1',
            x8y5: 'water-1',
            x8y6: 'water-1',
            x8y7: 'water-1',
            x8y8: 'water-1',
            x8y9: 'water-1',
            x8y10: 'water-1',
            x8y11: 'hill-1',
            x8y12: 'road-1',
            x8y13: 'stone-1',
            x8y14: 'stone-1',
            x9y0: 'stone-1',
            x9y1: 'terra-1',
            x9y2: 'road-1',
            x9y3: 'terra-1',
            x9y4: 'water-1',
            x9y5: 'water-2',
            x9y6: 'water-1',
            x9y7: 'water-1',
            x9y8: 'water-1',
            x9y9: 'water-1',
            x9y10: 'water-1',
            x9y11: 'hill-1',
            x9y12: 'road-1',
            x9y13: 'terra-1',
            x9y14: 'stone-1',
            x10y0: 'stone-1',
            x10y1: 'stone-1',
            x10y2: 'road-1',
            x10y3: 'terra-1',
            x10y4: 'water-1',
            x10y5: 'water-1',
            x10y6: 'water-1',
            x10y7: 'water-1',
            x10y8: 'water-2',
            x10y9: 'water-1',
            x10y10: 'water-1',
            x10y11: 'terra-1',
            x10y12: 'road-1',
            x10y13: 'stone-1',
            x10y14: 'stone-1',
            x11y0: 'terra-1',
            x11y1: 'terra-1',
            x11y2: 'road-1',
            x11y3: 'terra-1',
            x11y4: 'water-1',
            x11y5: 'water-1',
            x11y6: 'water-1',
            x11y7: 'water-1',
            x11y8: 'water-1',
            x11y9: 'water-1',
            x11y10: 'water-1',
            x11y11: 'terra-1',
            x11y12: 'road-1',
            x11y13: 'terra-1',
            x11y14: 'terra-1',
            x12y0: 'terra-1',
            x12y1: 'terra-1',
            x12y2: 'road-1',
            x12y3: 'forest-2',
            x12y4: 'terra-1',
            x12y5: 'terra-1',
            x12y6: 'hill-1',
            x12y7: 'road-1',
            x12y8: 'hill-1',
            x12y9: 'terra-1',
            x12y10: 'terra-1',
            x12y11: 'forest-2',
            x12y12: 'road-1',
            x12y13: 'terra-1',
            x12y14: 'terra-1',
            x13y0: 'terra-1',
            x13y1: 'terra-1',
            x13y2: 'road-1',
            x13y3: 'road-1',
            x13y4: 'road-1',
            x13y5: 'road-1',
            x13y6: 'road-1',
            x13y7: 'road-1',
            x13y8: 'road-1',
            x13y9: 'road-1',
            x13y10: 'road-1',
            x13y11: 'road-1',
            x13y12: 'road-1',
            x13y13: 'terra-1',
            x13y14: 'terra-1',
            x14y0: 'stone-1',
            x14y1: 'forest-1',
            x14y2: 'terra-1',
            x14y3: 'terra-1',
            x14y4: 'stone-1',
            x14y5: 'terra-1',
            x14y6: 'stone-1',
            x14y7: 'road-1',
            x14y8: 'stone-1',
            x14y9: 'terra-1',
            x14y10: 'stone-1',
            x14y11: 'terra-1',
            x14y12: 'terra-1',
            x14y13: 'forest-1',
            x14y14: 'stone-1',
            x15y0: 'terra-1',
            x15y1: 'stone-1',
            x15y2: 'terra-1',
            x15y3: 'terra-1',
            x15y4: 'stone-1',
            x15y5: 'stone-1',
            x15y6: 'stone-1',
            x15y7: 'stone-1',
            x15y8: 'stone-1',
            x15y9: 'stone-1',
            x15y10: 'stone-1',
            x15y11: 'terra-1',
            x15y12: 'terra-1',
            x15y13: 'stone-1',
            x15y14: 'terra-1'
        }
    };
})(window);
