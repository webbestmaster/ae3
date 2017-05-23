/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window, document */
	/*global APP */

	win.APP.maps = win.APP.maps || {};

	win.APP.maps.skirmish_001_014 = {
		version: 6,
		type: 'skirmish',
		size: {width: 19, height: 19},
		maxPlayers: 4,
		name: 'The crucible',
		'name-es': 'El crisol',
		'name-ru': 'Суровое испытание',
		units: [
			{x: 3, y: 3, type: 'commander', ownerId: 0},
			{x: 15, y: 3, type: 'commander', ownerId: 1},
			{x: 3, y: 15, type: 'commander', ownerId: 2},
			{x: 15, y: 15, type: 'commander', ownerId: 3}
		],
		buildings: [
			{x: 3, y: 3, type: 'castle', state: 'normal', ownerId: 0},
			{x: 8, y: 4, type: 'farm', state: 'destroyed'},
			{x: 10, y: 4, type: 'farm', state: 'destroyed'},
			{x: 9, y: 2, type: 'castle', state: 'normal'},
			{x: 15, y: 3, type: 'castle', state: 'normal', ownerId: 1},
			{x: 4, y: 8, type: 'farm', state: 'destroyed'},
			{x: 4, y: 10, type: 'farm', state: 'destroyed'},
			{x: 2, y: 9, type: 'castle', state: 'normal'},
			{x: 7, y: 11, type: 'farm', state: 'destroyed'},
			{x: 7, y: 7, type: 'farm', state: 'destroyed'},
			{x: 11, y: 7, type: 'farm', state: 'destroyed'},
			{x: 11, y: 11, type: 'farm', state: 'destroyed'},
			{x: 9, y: 9, type: 'castle', state: 'normal'},
			{x: 16, y: 9, type: 'castle', state: 'normal'},
			{x: 14, y: 8, type: 'farm', state: 'destroyed'},
			{x: 14, y: 10, type: 'farm', state: 'destroyed'},
			{x: 3, y: 15, type: 'castle', state: 'normal', ownerId: 2},
			{x: 8, y: 14, type: 'farm', state: 'destroyed'},
			{x: 10, y: 14, type: 'farm', state: 'destroyed'},
			{x: 9, y: 16, type: 'castle', state: 'normal'},
			{x: 15, y: 15, type: 'castle', state: 'normal', ownerId: 3}
		],
		terrain: {
			x0y0: 'water-1',
			x0y1: 'water-2',
			x0y2: 'water-1',
			x0y3: 'water-1',
			x0y4: 'water-3',
			x0y5: 'water-1',
			x1y0: 'water-1',
			x1y1: 'water-1',
			x1y2: 'water-1',
			x1y3: 'water-1',
			x1y4: 'water-1',
			x1y5: 'water-1',
			x2y0: 'water-1',
			x2y1: 'water-1',
			x2y2: 'stone-1',
			x2y3: 'forest-1',
			x2y4: 'hill-1',
			x2y5: 'water-1',
			x3y0: 'water-3',
			x3y1: 'water-1',
			x3y2: 'forest-2',
			x3y3: 'terra-1',
			x3y4: 'road-1',
			x3y5: 'bridge-2',
			x4y0: 'water-1',
			x4y1: 'water-1',
			x4y2: 'terra-1',
			x4y3: 'road-1',
			x4y4: 'stone-1',
			x4y5: 'water-1',
			x5y0: 'water-1',
			x5y1: 'water-1',
			x5y2: 'water-1',
			x5y3: 'bridge-1',
			x5y4: 'water-1',
			x5y5: 'water-1',
			x6y0: 'water-1',
			x6y1: 'water-1',
			x6y2: 'water-1',
			x6y3: 'bridge-1',
			x6y4: 'water-1',
			x6y5: 'water-1',
			x7y0: 'water-1',
			x7y1: 'water-1',
			x7y2: 'hill-1',
			x7y3: 'road-1',
			x7y4: 'forest-1',
			x7y5: 'water-1',
			x8y0: 'water-1',
			x8y1: 'water-1',
			x8y2: 'terra-1',
			x8y3: 'road-1',
			x8y4: 'terra-1',
			x8y5: 'water-1',
			x9y0: 'water-1',
			x9y1: 'water-1',
			x9y2: 'terra-1',
			x9y3: 'road-1',
			x9y4: 'road-1',
			x9y5: 'bridge-2',
			x10y0: 'water-2',
			x10y1: 'water-1',
			x10y2: 'stone-1',
			x10y3: 'road-1',
			x10y4: 'terra-1',
			x10y5: 'water-1',
			x11y0: 'water-1',
			x11y1: 'water-1',
			x11y2: 'forest-2',
			x11y3: 'road-1',
			x11y4: 'terra-1',
			x11y5: 'water-1',
			x12y0: 'water-1',
			x12y1: 'water-1',
			x12y2: 'water-1',
			x12y3: 'bridge-1',
			x12y4: 'water-1',
			x12y5: 'water-1',
			x13y0: 'water-1',
			x13y1: 'water-1',
			x13y2: 'water-1',
			x13y3: 'bridge-1',
			x13y4: 'water-1',
			x13y5: 'water-1',
			x14y0: 'water-1',
			x14y1: 'water-1',
			x14y2: 'hill-1',
			x14y3: 'road-1',
			x14y4: 'stone-1',
			x14y5: 'water-1',
			x15y0: 'water-1',
			x15y1: 'water-1',
			x15y2: 'forest-1',
			x15y3: 'terra-1',
			x15y4: 'road-1',
			x15y5: 'bridge-2',
			x16y0: 'water-1',
			x16y1: 'water-1',
			x16y2: 'stone-1',
			x16y3: 'forest-1',
			x16y4: 'terra-1',
			x16y5: 'water-1',
			x17y0: 'water-1',
			x17y1: 'water-1',
			x17y2: 'water-1',
			x17y3: 'water-1',
			x17y4: 'water-1',
			x17y5: 'water-1',
			x18y0: 'water-1',
			x18y1: 'water-1',
			x18y2: 'water-1',
			x18y3: 'water-3',
			x18y4: 'water-1',
			x18y5: 'water-1',
			x0y6: 'water-1',
			x1y6: 'water-1',
			x2y6: 'water-1',
			x3y6: 'bridge-2',
			x4y6: 'water-1',
			x5y6: 'water-1',
			x6y6: 'water-1',
			x7y6: 'water-1',
			x8y6: 'water-1',
			x9y6: 'bridge-2',
			x10y6: 'water-1',
			x11y6: 'water-1',
			x12y6: 'water-1',
			x13y6: 'water-1',
			x14y6: 'water-1',
			x15y6: 'bridge-2',
			x16y6: 'water-1',
			x17y6: 'water-1',
			x18y6: 'water-1',
			x0y7: 'water-1',
			x1y7: 'water-1',
			x2y7: 'forest-2',
			x3y7: 'road-1',
			x4y7: 'terra-1',
			x5y7: 'water-1',
			x6y7: 'water-1',
			x7y7: 'terra-1',
			x8y7: 'hill-1',
			x9y7: 'road-1',
			x10y7: 'forest-1',
			x11y7: 'terra-1',
			x12y7: 'water-1',
			x13y7: 'water-1',
			x14y7: 'forest-1',
			x15y7: 'road-1',
			x16y7: 'hill-1',
			x17y7: 'water-1',
			x18y7: 'water-1',
			x0y8: 'water-1',
			x1y8: 'water-1',
			x2y8: 'stone-1',
			x3y8: 'road-1',
			x4y8: 'terra-1',
			x5y8: 'water-1',
			x6y8: 'water-1',
			x7y8: 'forest-1',
			x8y8: 'terra-1',
			x9y8: 'road-1',
			x10y8: 'stone-1',
			x11y8: 'forest-1',
			x12y8: 'water-1',
			x13y8: 'water-1',
			x14y8: 'terra-1',
			x15y8: 'road-1',
			x16y8: 'terra-1',
			x17y8: 'water-1',
			x18y8: 'water-1',
			x0y9: 'water-1',
			x1y9: 'water-1',
			x2y9: 'terra-1',
			x3y9: 'road-1',
			x4y9: 'road-1',
			x5y9: 'bridge-1',
			x6y9: 'bridge-1',
			x7y9: 'road-1',
			x8y9: 'road-1',
			x9y9: 'terra-1',
			x10y9: 'road-1',
			x11y9: 'road-1',
			x12y9: 'bridge-1',
			x13y9: 'bridge-1',
			x14y9: 'road-1',
			x15y9: 'road-1',
			x16y9: 'terra-1',
			x17y9: 'water-1',
			x18y9: 'water-1',
			x0y10: 'water-1',
			x1y10: 'water-1',
			x2y10: 'terra-1',
			x3y10: 'road-1',
			x4y10: 'terra-1',
			x5y10: 'water-1',
			x6y10: 'water-1',
			x7y10: 'forest-1',
			x8y10: 'stone-1',
			x9y10: 'road-1',
			x10y10: 'terra-1',
			x11y10: 'forest-1',
			x12y10: 'water-1',
			x13y10: 'water-1',
			x14y10: 'terra-1',
			x15y10: 'road-1',
			x16y10: 'stone-1',
			x17y10: 'water-1',
			x18y10: 'water-2',
			x0y11: 'water-1',
			x1y11: 'water-1',
			x2y11: 'hill-1',
			x3y11: 'road-1',
			x4y11: 'forest-1',
			x5y11: 'water-1',
			x6y11: 'water-1',
			x7y11: 'terra-1',
			x8y11: 'forest-1',
			x9y11: 'road-1',
			x10y11: 'hill-1',
			x11y11: 'terra-1',
			x12y11: 'water-1',
			x13y11: 'water-1',
			x14y11: 'terra-1',
			x15y11: 'road-1',
			x16y11: 'forest-2',
			x17y11: 'water-1',
			x18y11: 'water-1',
			x0y12: 'water-1',
			x1y12: 'water-1',
			x2y12: 'water-1',
			x3y12: 'bridge-2',
			x4y12: 'water-1',
			x5y12: 'water-1',
			x6y12: 'water-1',
			x7y12: 'water-1',
			x8y12: 'water-1',
			x9y12: 'bridge-2',
			x10y12: 'water-1',
			x11y12: 'water-1',
			x12y12: 'water-1',
			x13y12: 'water-1',
			x14y12: 'water-1',
			x15y12: 'bridge-2',
			x16y12: 'water-1',
			x17y12: 'water-1',
			x18y12: 'water-1',
			x0y13: 'water-3',
			x1y13: 'water-1',
			x2y13: 'water-1',
			x3y13: 'bridge-2',
			x4y13: 'water-1',
			x5y13: 'water-1',
			x6y13: 'water-1',
			x7y13: 'water-1',
			x8y13: 'water-1',
			x9y13: 'bridge-2',
			x10y13: 'water-1',
			x11y13: 'water-1',
			x12y13: 'water-1',
			x13y13: 'water-1',
			x14y13: 'water-1',
			x15y13: 'bridge-2',
			x16y13: 'water-1',
			x17y13: 'water-1',
			x18y13: 'water-1',
			x0y14: 'water-1',
			x1y14: 'water-1',
			x2y14: 'terra-1',
			x3y14: 'road-1',
			x4y14: 'stone-1',
			x5y14: 'water-1',
			x6y14: 'water-1',
			x7y14: 'terra-1',
			x8y14: 'terra-1',
			x9y14: 'road-1',
			x10y14: 'terra-1',
			x11y14: 'forest-1',
			x12y14: 'water-1',
			x13y14: 'water-1',
			x14y14: 'stone-1',
			x15y14: 'road-1',
			x16y14: 'hill-1',
			x17y14: 'water-1',
			x18y14: 'water-1',
			x0y15: 'water-1',
			x1y15: 'water-1',
			x2y15: 'forest-1',
			x3y15: 'terra-1',
			x4y15: 'road-1',
			x5y15: 'bridge-1',
			x6y15: 'bridge-1',
			x7y15: 'road-1',
			x8y15: 'road-1',
			x9y15: 'road-1',
			x10y15: 'road-1',
			x11y15: 'road-1',
			x12y15: 'bridge-1',
			x13y15: 'bridge-1',
			x14y15: 'road-1',
			x15y15: 'terra-1',
			x16y15: 'forest-1',
			x17y15: 'water-1',
			x18y15: 'water-1',
			x0y16: 'water-1',
			x1y16: 'water-1',
			x2y16: 'stone-1',
			x3y16: 'forest-2',
			x4y16: 'hill-1',
			x5y16: 'water-1',
			x6y16: 'water-1',
			x7y16: 'forest-1',
			x8y16: 'stone-1',
			x9y16: 'terra-1',
			x10y16: 'hill-1',
			x11y16: 'terra-1',
			x12y16: 'water-1',
			x13y16: 'water-1',
			x14y16: 'terra-1',
			x15y16: 'forest-2',
			x16y16: 'stone-1',
			x17y16: 'water-1',
			x18y16: 'water-1',
			x0y17: 'water-1',
			x1y17: 'water-1',
			x2y17: 'water-1',
			x3y17: 'water-1',
			x4y17: 'water-1',
			x5y17: 'water-1',
			x6y17: 'water-1',
			x7y17: 'water-1',
			x8y17: 'water-1',
			x9y17: 'water-1',
			x10y17: 'water-1',
			x11y17: 'water-1',
			x12y17: 'water-1',
			x13y17: 'water-1',
			x14y17: 'water-1',
			x15y17: 'water-1',
			x16y17: 'water-1',
			x17y17: 'water-1',
			x18y17: 'water-2',
			x0y18: 'water-1',
			x1y18: 'water-1',
			x2y18: 'water-1',
			x3y18: 'water-1',
			x4y18: 'water-1',
			x5y18: 'water-1',
			x6y18: 'water-2',
			x7y18: 'water-1',
			x8y18: 'water-1',
			x9y18: 'water-1',
			x10y18: 'water-1',
			x11y18: 'water-1',
			x12y18: 'water-3',
			x13y18: 'water-1',
			x14y18: 'water-1',
			x15y18: 'water-1',
			x16y18: 'water-1',
			x17y18: 'water-3',
			x18y18: 'water-1'
		}
	};

}(window));