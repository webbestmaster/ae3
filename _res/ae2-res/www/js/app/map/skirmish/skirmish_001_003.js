/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_003 = {
        version: 6,
        type: 'skirmish',
        size: {width: 17, height: 12},
        maxPlayers: 2,
        name: 'Rocky bay',
        'name-es': 'Bahía rocosa',
        'name-ru': 'Скалистая бухта',
        units: [{type: 'commander', x: 1, y: 9, ownerId: 0}, {type: 'commander', x: 15, y: 9, ownerId: 1}],
        buildings: [
            {type: 'farm', x: 0, y: 2, state: 'normal'},
            {type: 'farm', x: 6, y: 2, state: 'normal'},
            {type: 'castle', x: 8, y: 2, state: 'normal'},
            {type: 'farm', x: 10, y: 2, state: 'normal'},
            {type: 'farm', x: 16, y: 2, state: 'normal'},
            {type: 'farm', x: 2, y: 3, state: 'normal'},
            {type: 'farm', x: 14, y: 3, state: 'normal'},
            {type: 'castle', x: 1, y: 9, state: 'normal', ownerId: 0},
            {type: 'farm', x: 3, y: 9, state: 'normal'},
            {type: 'farm', x: 13, y: 9, state: 'normal'},
            {type: 'castle', x: 15, y: 9, state: 'normal', ownerId: 1},
            {type: 'farm', x: 2, y: 11, state: 'normal'},
            {type: 'farm', x: 14, y: 11, state: 'normal'}
        ],
        terrain: {
            x0y0: 'stone-1',
            x1y0: 'stone-1',
            x2y0: 'terra-1',
            x3y0: 'stone-1',
            x4y0: 'forest-1',
            x5y0: 'terra-1',
            x6y0: 'stone-1',
            x7y0: 'terra-1',
            x8y0: 'stone-1',
            x9y0: 'terra-1',
            x10y0: 'stone-1',
            x11y0: 'terra-1',
            x12y0: 'forest-1',
            x13y0: 'stone-1',
            x14y0: 'terra-1',
            x15y0: 'stone-1',
            x16y0: 'stone-1',
            x0y1: 'stone-1',
            x1y1: 'forest-1',
            x2y1: 'stone-1',
            x3y1: 'stone-1',
            x4y1: 'stone-1',
            x5y1: 'terra-1',
            x6y1: 'terra-1',
            x7y1: 'forest-1',
            x8y1: 'terra-1',
            x9y1: 'forest-1',
            x10y1: 'terra-1',
            x11y1: 'terra-1',
            x12y1: 'stone-1',
            x13y1: 'stone-1',
            x14y1: 'stone-1',
            x15y1: 'forest-1',
            x16y1: 'stone-1',
            x0y2: 'terra-1',
            x1y2: 'forest-1',
            x2y2: 'forest-1',
            x3y2: 'stone-1',
            x4y2: 'hill-1',
            x5y2: 'forest-1',
            x6y2: 'terra-1',
            x7y2: 'terra-1',
            x8y2: 'terra-1',
            x9y2: 'terra-1',
            x10y2: 'terra-1',
            x11y2: 'forest-1',
            x12y2: 'hill-1',
            x13y2: 'stone-1',
            x14y2: 'forest-1',
            x15y2: 'forest-1',
            x16y2: 'terra-1',
            x0y3: 'forest-1',
            x1y3: 'forest-1',
            x2y3: 'terra-1',
            x3y3: 'terra-1',
            x4y3: 'road-1',
            x5y3: 'road-1',
            x6y3: 'road-1',
            x7y3: 'road-1',
            x8y3: 'road-1',
            x9y3: 'road-1',
            x10y3: 'road-1',
            x11y3: 'road-1',
            x12y3: 'road-1',
            x13y3: 'terra-1',
            x14y3: 'terra-1',
            x15y3: 'forest-1',
            x16y3: 'forest-1',
            x0y4: 'hill-1',
            x1y4: 'forest-1',
            x2y4: 'terra-1',
            x3y4: 'stone-1',
            x4y4: 'road-1',
            x5y4: 'terra-1',
            x6y4: 'forest-1',
            x7y4: 'terra-1',
            x8y4: 'terra-1',
            x9y4: 'terra-1',
            x10y4: 'forest-1',
            x11y4: 'terra-1',
            x12y4: 'road-1',
            x13y4: 'stone-1',
            x14y4: 'terra-1',
            x15y4: 'forest-1',
            x16y4: 'hill-1',
            x0y5: 'forest-1',
            x1y5: 'forest-1',
            x2y5: 'hill-1',
            x3y5: 'terra-1',
            x4y5: 'road-1',
            x5y5: 'forest-1',
            x6y5: 'terra-1',
            x7y5: 'water-1',
            x8y5: 'water-1',
            x9y5: 'water-1',
            x10y5: 'terra-1',
            x11y5: 'forest-1',
            x12y5: 'road-1',
            x13y5: 'terra-1',
            x14y5: 'hill-1',
            x15y5: 'forest-1',
            x16y5: 'forest-1',
            x0y6: 'stone-1',
            x1y6: 'forest-1',
            x2y6: 'stone-1',
            x3y6: 'hill-1',
            x4y6: 'road-1',
            x5y6: 'stone-1',
            x6y6: 'terra-1',
            x7y6: 'water-1',
            x8y6: 'water-1',
            x9y6: 'water-1',
            x10y6: 'terra-1',
            x11y6: 'stone-1',
            x12y6: 'road-1',
            x13y6: 'hill-1',
            x14y6: 'stone-1',
            x15y6: 'forest-1',
            x16y6: 'stone-1',
            x0y7: 'forest-1',
            x1y7: 'stone-1',
            x2y7: 'terra-1',
            x3y7: 'terra-1',
            x4y7: 'road-1',
            x5y7: 'stone-1',
            x6y7: 'terra-1',
            x7y7: 'water-1',
            x8y7: 'water-1',
            x9y7: 'water-1',
            x10y7: 'terra-1',
            x11y7: 'stone-1',
            x12y7: 'road-1',
            x13y7: 'terra-1',
            x14y7: 'terra-1',
            x15y7: 'stone-1',
            x16y7: 'forest-1',
            x0y8: 'terra-1',
            x1y8: 'terra-1',
            x2y8: 'forest-1',
            x3y8: 'terra-1',
            x4y8: 'road-1',
            x5y8: 'stone-1',
            x6y8: 'terra-1',
            x7y8: 'water-1',
            x8y8: 'water-1',
            x9y8: 'water-1',
            x10y8: 'terra-1',
            x11y8: 'stone-1',
            x12y8: 'road-1',
            x13y8: 'terra-1',
            x14y8: 'forest-1',
            x15y8: 'terra-1',
            x16y8: 'terra-1',
            x0y9: 'forest-1',
            x1y9: 'terra-1',
            x2y9: 'terra-1',
            x3y9: 'terra-1',
            x4y9: 'road-1',
            x5y9: 'stone-1',
            x6y9: 'terra-1',
            x7y9: 'water-1',
            x8y9: 'water-1',
            x9y9: 'water-1',
            x10y9: 'terra-1',
            x11y9: 'stone-1',
            x12y9: 'road-1',
            x13y9: 'terra-1',
            x14y9: 'terra-1',
            x15y9: 'terra-1',
            x16y9: 'forest-1',
            x0y10: 'road-1',
            x1y10: 'road-1',
            x2y10: 'road-1',
            x3y10: 'road-1',
            x4y10: 'road-1',
            x5y10: 'stone-1',
            x6y10: 'terra-1',
            x7y10: 'water-1',
            x8y10: 'water-1',
            x9y10: 'water-1',
            x10y10: 'terra-1',
            x11y10: 'stone-1',
            x12y10: 'road-1',
            x13y10: 'road-1',
            x14y10: 'road-1',
            x15y10: 'road-1',
            x16y10: 'road-1',
            x0y11: 'terra-1',
            x1y11: 'forest-1',
            x2y11: 'terra-1',
            x3y11: 'hill-1',
            x4y11: 'forest-1',
            x5y11: 'terra-1',
            x6y11: 'terra-1',
            x7y11: 'water-1',
            x8y11: 'water-1',
            x9y11: 'water-1',
            x10y11: 'terra-1',
            x11y11: 'terra-1',
            x12y11: 'forest-1',
            x13y11: 'hill-1',
            x14y11: 'terra-1',
            x15y11: 'forest-1',
            x16y11: 'terra-1'
        }
    };
})(window);