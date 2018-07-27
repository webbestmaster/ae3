/*jslint white: true, nomen: true */
(function(win) {
    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_054 = {
        type: 'skirmish',
        size: {width: 15, height: 15},
        name: 'Scythe',
        'name-es': 'Guadaña',
        'name-ru': 'Коса',
        isOpen: true,
        maxPlayers: 2,
        units: [{x: 14, y: 0, type: 'commander', ownerId: 1}, {x: 0, y: 14, type: 'commander', ownerId: 0}],
        buildings: [
            {x: 2, y: 2, type: 'castle', state: 'normal'},
            {x: 12, y: 12, type: 'castle', state: 'normal'},
            {x: 9, y: 9, type: 'farm', state: 'normal'},
            {x: 5, y: 5, type: 'farm', state: 'normal'},
            {x: 7, y: 7, type: 'well', state: 'normal'},
            {x: 8, y: 6, type: 'well', state: 'normal'},
            {x: 6, y: 8, type: 'well', state: 'normal'},
            {x: 12, y: 6, type: 'castle', state: 'normal'},
            {x: 2, y: 8, type: 'castle', state: 'normal'},
            {x: 6, y: 12, type: 'castle', state: 'normal'},
            {x: 8, y: 2, type: 'castle', state: 'normal'},
            {x: 8, y: 0, type: 'farm', state: 'normal'},
            {x: 6, y: 0, type: 'farm', state: 'normal'},
            {x: 10, y: 0, type: 'farm', state: 'normal'},
            {x: 12, y: 0, type: 'farm', state: 'normal'},
            {x: 14, y: 2, type: 'farm', state: 'normal'},
            {x: 12, y: 2, type: 'farm', state: 'normal'},
            {x: 10, y: 4, type: 'farm', state: 'normal'},
            {x: 14, y: 4, type: 'farm', state: 'normal'},
            {x: 14, y: 6, type: 'farm', state: 'normal'},
            {x: 14, y: 8, type: 'farm', state: 'normal'},
            {x: 8, y: 14, type: 'farm', state: 'normal'},
            {x: 6, y: 14, type: 'farm', state: 'normal'},
            {x: 4, y: 14, type: 'farm', state: 'normal'},
            {x: 2, y: 14, type: 'farm', state: 'normal'},
            {x: 2, y: 12, type: 'farm', state: 'normal'},
            {x: 0, y: 12, type: 'farm', state: 'normal'},
            {x: 0, y: 10, type: 'farm', state: 'normal'},
            {x: 4, y: 10, type: 'farm', state: 'normal'},
            {x: 0, y: 8, type: 'farm', state: 'normal'},
            {x: 0, y: 6, type: 'farm', state: 'normal'},
            {x: 14, y: 0, type: 'castle', state: 'normal', ownerId: 1},
            {x: 0, y: 14, type: 'castle', state: 'normal', ownerId: 0}
        ],
        terrain: {
            x0y0: 'stone-1',
            x0y1: 'stone-1',
            x0y2: 'forest-1',
            x0y3: 'hill-1',
            x0y4: 'terra-1',
            x0y5: 'terra-1',
            x0y6: 'terra-1',
            x0y7: 'terra-1',
            x0y8: 'terra-1',
            x0y9: 'terra-1',
            x0y10: 'terra-1',
            x1y0: 'stone-1',
            x1y1: 'stone-1',
            x1y2: 'stone-1',
            x1y3: 'forest-1',
            x1y4: 'hill-1',
            x1y5: 'terra-1',
            x1y6: 'terra-1',
            x1y7: 'terra-1',
            x1y8: 'terra-1',
            x1y9: 'terra-1',
            x1y10: 'terra-1',
            x2y0: 'forest-1',
            x2y1: 'stone-1',
            x2y2: 'road-1',
            x2y3: 'stone-1',
            x2y4: 'forest-1',
            x2y5: 'hill-1',
            x2y6: 'terra-1',
            x2y7: 'terra-1',
            x2y8: 'road-1',
            x2y9: 'terra-1',
            x2y10: 'terra-1',
            x3y0: 'hill-1',
            x3y1: 'forest-1',
            x3y2: 'stone-1',
            x3y3: 'stone-1',
            x3y4: 'stone-1',
            x3y5: 'forest-1',
            x3y6: 'hill-1',
            x3y7: 'terra-1',
            x3y8: 'terra-1',
            x3y9: 'terra-1',
            x3y10: 'terra-1',
            x4y0: 'terra-1',
            x4y1: 'hill-1',
            x4y2: 'forest-1',
            x4y3: 'stone-1',
            x4y4: 'stone-1',
            x4y5: 'stone-1',
            x4y6: 'forest-1',
            x4y7: 'hill-1',
            x4y8: 'terra-1',
            x4y9: 'terra-1',
            x4y10: 'terra-1',
            x5y0: 'terra-1',
            x5y1: 'terra-1',
            x5y2: 'hill-1',
            x5y3: 'forest-1',
            x5y4: 'stone-1',
            x5y5: 'terra-1',
            x5y6: 'stone-1',
            x5y7: 'forest-1',
            x5y8: 'hill-1',
            x5y9: 'terra-1',
            x5y10: 'terra-1',
            x6y0: 'terra-1',
            x6y1: 'terra-1',
            x6y2: 'terra-1',
            x6y3: 'hill-1',
            x6y4: 'forest-1',
            x6y5: 'stone-1',
            x6y6: 'stone-1',
            x6y7: 'stone-1',
            x6y8: 'road-1',
            x6y9: 'hill-1',
            x6y10: 'terra-1',
            x7y0: 'terra-1',
            x7y1: 'terra-1',
            x7y2: 'terra-1',
            x7y3: 'terra-1',
            x7y4: 'hill-1',
            x7y5: 'forest-1',
            x7y6: 'stone-1',
            x7y7: 'road-1',
            x7y8: 'stone-1',
            x7y9: 'forest-1',
            x7y10: 'hill-1',
            x8y0: 'terra-1',
            x8y1: 'terra-1',
            x8y2: 'road-1',
            x8y3: 'terra-1',
            x8y4: 'terra-1',
            x8y5: 'hill-1',
            x8y6: 'road-1',
            x8y7: 'stone-1',
            x8y8: 'stone-1',
            x8y9: 'stone-1',
            x8y10: 'forest-1',
            x9y0: 'terra-1',
            x9y1: 'terra-1',
            x9y2: 'terra-1',
            x9y3: 'terra-1',
            x9y4: 'terra-1',
            x9y5: 'terra-1',
            x9y6: 'hill-1',
            x9y7: 'forest-1',
            x9y8: 'stone-1',
            x9y9: 'terra-1',
            x9y10: 'stone-1',
            x10y0: 'terra-1',
            x10y1: 'terra-1',
            x10y2: 'terra-1',
            x10y3: 'terra-1',
            x10y4: 'terra-1',
            x10y5: 'terra-1',
            x10y6: 'terra-1',
            x10y7: 'hill-1',
            x10y8: 'forest-1',
            x10y9: 'stone-1',
            x10y10: 'stone-1',
            x0y11: 'terra-1',
            x1y11: 'terra-1',
            x2y11: 'terra-1',
            x3y11: 'terra-1',
            x4y11: 'terra-1',
            x5y11: 'terra-1',
            x6y11: 'terra-1',
            x7y11: 'terra-1',
            x8y11: 'hill-1',
            x9y11: 'forest-1',
            x10y11: 'stone-1',
            x0y12: 'terra-1',
            x1y12: 'terra-1',
            x2y12: 'terra-1',
            x3y12: 'terra-1',
            x4y12: 'terra-1',
            x5y12: 'terra-1',
            x6y12: 'road-1',
            x7y12: 'terra-1',
            x8y12: 'terra-1',
            x9y12: 'hill-1',
            x10y12: 'forest-1',
            x0y13: 'terra-1',
            x1y13: 'terra-1',
            x2y13: 'terra-1',
            x3y13: 'terra-1',
            x4y13: 'terra-1',
            x5y13: 'terra-1',
            x6y13: 'terra-1',
            x7y13: 'terra-1',
            x8y13: 'terra-1',
            x9y13: 'terra-1',
            x10y13: 'hill-1',
            x0y14: 'road-1',
            x1y14: 'terra-1',
            x2y14: 'terra-1',
            x3y14: 'terra-1',
            x4y14: 'terra-1',
            x5y14: 'terra-1',
            x6y14: 'terra-1',
            x7y14: 'terra-1',
            x8y14: 'terra-1',
            x9y14: 'terra-1',
            x10y14: 'terra-1',
            x11y0: 'terra-1',
            x11y1: 'terra-1',
            x11y2: 'terra-1',
            x11y3: 'terra-1',
            x11y4: 'terra-1',
            x11y5: 'terra-1',
            x11y6: 'terra-1',
            x11y7: 'terra-1',
            x11y8: 'hill-1',
            x11y9: 'forest-1',
            x11y10: 'stone-1',
            x11y11: 'stone-1',
            x11y12: 'stone-1',
            x11y13: 'forest-1',
            x11y14: 'hill-1',
            x12y0: 'terra-1',
            x12y1: 'terra-1',
            x12y2: 'terra-1',
            x12y3: 'terra-1',
            x12y4: 'terra-1',
            x12y5: 'terra-1',
            x12y6: 'road-1',
            x12y7: 'terra-1',
            x12y8: 'terra-1',
            x12y9: 'hill-1',
            x12y10: 'forest-1',
            x12y11: 'stone-1',
            x12y12: 'road-1',
            x12y13: 'stone-1',
            x12y14: 'forest-1',
            x13y0: 'terra-1',
            x13y1: 'terra-1',
            x13y2: 'terra-1',
            x13y3: 'terra-1',
            x13y4: 'terra-1',
            x13y5: 'terra-1',
            x13y6: 'terra-1',
            x13y7: 'terra-1',
            x13y8: 'terra-1',
            x13y9: 'terra-1',
            x13y10: 'hill-1',
            x13y11: 'forest-1',
            x13y12: 'stone-1',
            x13y13: 'stone-1',
            x13y14: 'stone-1',
            x14y0: 'road-1',
            x14y1: 'terra-1',
            x14y2: 'terra-1',
            x14y3: 'terra-1',
            x14y4: 'terra-1',
            x14y5: 'terra-1',
            x14y6: 'terra-1',
            x14y7: 'terra-1',
            x14y8: 'terra-1',
            x14y9: 'terra-1',
            x14y10: 'terra-1',
            x14y11: 'hill-1',
            x14y12: 'forest-1',
            x14y13: 'stone-1',
            x14y14: 'stone-1'
        }
    };
})(window);
