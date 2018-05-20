/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window, document */
	/*global APP */

	win.APP.maps = win.APP.maps || {};

	win.APP.maps.skirmish_001_062 = {
		"type": "skirmish",
		"size": {"width": 17, "height": 17},
		"name": "Rabies",
		"name-es": "Rabia",
		"name-ru": "Бешенство",
		"isOpen": true,
		"maxPlayers": 4,
		"units": [{"x": 0, "y": 0, "type": "commander", "ownerId": 0}, {"x": 16, "y": 0, "type": "commander", "ownerId": 1}, {"x": 0, "y": 16, "type": "commander", "ownerId": 2}, {"x": 16, "y": 16, "type": "commander", "ownerId": 3}],
		"buildings": [{"x": 8, "y": 8, "type": "castle", "state": "normal"}, {"x": 7, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 0, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 0, "type": "farm", "state": "destroyed"}, {
			"x": 15,
			"y": 1,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 13, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 1, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 2, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 3, "type": "farm", "state": "destroyed"}, {
			"x": 7,
			"y": 3,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 5, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 3, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 4, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 5, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 5, "type": "farm", "state": "destroyed"}, {
			"x": 0,
			"y": 6,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 2, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 6, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 12, "type": "farm", "state": "destroyed"}, {
			"x": 10,
			"y": 12,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 12, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 7, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 14, "type": "farm", "state": "destroyed"}, {
			"x": 8,
			"y": 14,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 10, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 9, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 15, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 13, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 11, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 9, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 7, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 5, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 3, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 15, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 13, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 11, "type": "farm", "state": "destroyed"}, {"x": 1, "y": 9, "type": "farm", "state": "destroyed"}, {
			"x": 1,
			"y": 7,
			"type": "farm",
			"state": "destroyed"
		}, {"x": 0, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 2, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 4, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 6, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 8, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 10, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 12, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 14, "y": 16, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 14, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 12, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 10, "type": "farm", "state": "destroyed"}, {"x": 16, "y": 8, "type": "farm", "state": "destroyed"}, {"x": 0, "y": 0, "type": "castle", "state": "normal", "ownerId": 0}, {"x": 16, "y": 0, "type": "castle", "state": "normal", "ownerId": 1}, {"x": 0, "y": 16, "type": "castle", "state": "normal", "ownerId": 2}, {"x": 16, "y": 16, "type": "castle", "state": "normal", "ownerId": 3}],
		"terrain": {
			"x0y0": "road-1",
			"x0y1": "bridge-2",
			"x0y2": "terra-1",
			"x0y3": "bridge-2",
			"x0y4": "terra-1",
			"x0y5": "bridge-2",
			"x0y6": "terra-1",
			"x0y7": "bridge-2",
			"x0y8": "terra-1",
			"x0y9": "bridge-2",
			"x0y10": "terra-1",
			"x1y0": "bridge-1",
			"x1y1": "terra-1",
			"x1y2": "road-1",
			"x1y3": "terra-1",
			"x1y4": "road-1",
			"x1y5": "terra-1",
			"x1y6": "road-1",
			"x1y7": "terra-1",
			"x1y8": "road-1",
			"x1y9": "terra-1",
			"x1y10": "road-1",
			"x2y0": "terra-1",
			"x2y1": "road-1",
			"x2y2": "terra-1",
			"x2y3": "water-1",
			"x2y4": "terra-1",
			"x2y5": "water-1",
			"x2y6": "terra-1",
			"x2y7": "water-1",
			"x2y8": "terra-1",
			"x2y9": "water-1",
			"x2y10": "terra-1",
			"x3y0": "bridge-1",
			"x3y1": "terra-1",
			"x3y2": "water-1",
			"x3y3": "terra-1",
			"x3y4": "water-1",
			"x3y5": "terra-1",
			"x3y6": "water-1",
			"x3y7": "terra-1",
			"x3y8": "water-1",
			"x3y9": "terra-1",
			"x3y10": "water-1",
			"x4y0": "terra-1",
			"x4y1": "road-1",
			"x4y2": "terra-1",
			"x4y3": "water-1",
			"x4y4": "terra-1",
			"x4y5": "stone-1",
			"x4y6": "terra-1",
			"x4y7": "stone-1",
			"x4y8": "terra-1",
			"x4y9": "stone-1",
			"x4y10": "terra-1",
			"x5y0": "bridge-1",
			"x5y1": "terra-1",
			"x5y2": "water-1",
			"x5y3": "terra-1",
			"x5y4": "stone-1",
			"x5y5": "terra-1",
			"x5y6": "forest-1",
			"x5y7": "terra-1",
			"x5y8": "forest-1",
			"x5y9": "terra-1",
			"x5y10": "forest-1",
			"x6y0": "terra-1",
			"x6y1": "road-1",
			"x6y2": "terra-1",
			"x6y3": "water-1",
			"x6y4": "terra-1",
			"x6y5": "forest-1",
			"x6y6": "terra-1",
			"x6y7": "hill-1",
			"x6y8": "terra-1",
			"x6y9": "hill-1",
			"x6y10": "terra-1",
			"x7y0": "bridge-1",
			"x7y1": "terra-1",
			"x7y2": "water-1",
			"x7y3": "terra-1",
			"x7y4": "stone-1",
			"x7y5": "terra-1",
			"x7y6": "hill-1",
			"x7y7": "terra-1",
			"x7y8": "terra-1",
			"x7y9": "terra-1",
			"x7y10": "hill-1",
			"x8y0": "terra-1",
			"x8y1": "road-1",
			"x8y2": "terra-1",
			"x8y3": "water-1",
			"x8y4": "terra-1",
			"x8y5": "forest-1",
			"x8y6": "terra-1",
			"x8y7": "terra-1",
			"x8y8": "road-1",
			"x8y9": "terra-1",
			"x8y10": "terra-1",
			"x9y0": "bridge-1",
			"x9y1": "terra-1",
			"x9y2": "water-1",
			"x9y3": "terra-1",
			"x9y4": "stone-1",
			"x9y5": "terra-1",
			"x9y6": "hill-1",
			"x9y7": "terra-1",
			"x9y8": "terra-1",
			"x9y9": "terra-1",
			"x9y10": "hill-1",
			"x10y0": "terra-1",
			"x10y1": "road-1",
			"x10y2": "terra-1",
			"x10y3": "water-1",
			"x10y4": "terra-1",
			"x10y5": "forest-1",
			"x10y6": "terra-1",
			"x10y7": "hill-1",
			"x10y8": "terra-1",
			"x10y9": "hill-1",
			"x10y10": "terra-1",
			"x11y0": "bridge-1",
			"x11y1": "terra-1",
			"x11y2": "water-1",
			"x11y3": "terra-1",
			"x11y4": "stone-1",
			"x11y5": "terra-1",
			"x11y6": "forest-1",
			"x11y7": "terra-1",
			"x11y8": "forest-1",
			"x11y9": "terra-1",
			"x11y10": "forest-1",
			"x12y0": "terra-1",
			"x12y1": "road-1",
			"x12y2": "terra-1",
			"x12y3": "water-1",
			"x12y4": "terra-1",
			"x12y5": "stone-1",
			"x12y6": "terra-1",
			"x12y7": "stone-1",
			"x12y8": "terra-1",
			"x12y9": "stone-1",
			"x12y10": "terra-1",
			"x13y0": "bridge-1",
			"x13y1": "terra-1",
			"x13y2": "water-1",
			"x13y3": "terra-1",
			"x13y4": "water-1",
			"x13y5": "terra-1",
			"x13y6": "water-1",
			"x13y7": "terra-1",
			"x13y8": "water-1",
			"x13y9": "terra-1",
			"x13y10": "water-1",
			"x14y0": "terra-1",
			"x14y1": "road-1",
			"x14y2": "terra-1",
			"x14y3": "water-1",
			"x14y4": "terra-1",
			"x14y5": "water-1",
			"x14y6": "terra-1",
			"x14y7": "water-1",
			"x14y8": "terra-1",
			"x14y9": "water-1",
			"x14y10": "terra-1",
			"x15y0": "bridge-1",
			"x15y1": "terra-1",
			"x15y2": "road-1",
			"x15y3": "terra-1",
			"x15y4": "road-1",
			"x15y5": "terra-1",
			"x15y6": "road-1",
			"x15y7": "terra-1",
			"x15y8": "road-1",
			"x15y9": "terra-1",
			"x15y10": "road-1",
			"x16y0": "road-1",
			"x16y1": "bridge-2",
			"x16y2": "terra-1",
			"x16y3": "bridge-2",
			"x16y4": "terra-1",
			"x16y5": "bridge-2",
			"x16y6": "terra-1",
			"x16y7": "bridge-2",
			"x16y8": "terra-1",
			"x16y9": "bridge-2",
			"x16y10": "terra-1",
			"x0y11": "bridge-2",
			"x1y11": "terra-1",
			"x2y11": "water-1",
			"x3y11": "terra-1",
			"x4y11": "stone-1",
			"x5y11": "terra-1",
			"x6y11": "forest-1",
			"x7y11": "terra-1",
			"x8y11": "forest-1",
			"x9y11": "terra-1",
			"x10y11": "forest-1",
			"x11y11": "terra-1",
			"x12y11": "stone-1",
			"x13y11": "terra-1",
			"x14y11": "water-1",
			"x15y11": "terra-1",
			"x16y11": "bridge-2",
			"x0y12": "terra-1",
			"x1y12": "road-1",
			"x2y12": "terra-1",
			"x3y12": "water-1",
			"x4y12": "terra-1",
			"x5y12": "stone-1",
			"x6y12": "terra-1",
			"x7y12": "stone-1",
			"x8y12": "terra-1",
			"x9y12": "stone-1",
			"x10y12": "terra-1",
			"x11y12": "stone-1",
			"x12y12": "terra-1",
			"x13y12": "water-1",
			"x14y12": "terra-1",
			"x15y12": "road-1",
			"x16y12": "terra-1",
			"x0y13": "bridge-2",
			"x1y13": "terra-1",
			"x2y13": "water-1",
			"x3y13": "terra-1",
			"x4y13": "water-1",
			"x5y13": "terra-1",
			"x6y13": "water-1",
			"x7y13": "terra-1",
			"x8y13": "water-1",
			"x9y13": "terra-1",
			"x10y13": "water-1",
			"x11y13": "terra-1",
			"x12y13": "water-1",
			"x13y13": "terra-1",
			"x14y13": "water-1",
			"x15y13": "terra-1",
			"x16y13": "bridge-2",
			"x0y14": "terra-1",
			"x1y14": "road-1",
			"x2y14": "terra-1",
			"x3y14": "water-1",
			"x4y14": "terra-1",
			"x5y14": "water-1",
			"x6y14": "terra-1",
			"x7y14": "water-1",
			"x8y14": "terra-1",
			"x9y14": "water-1",
			"x10y14": "terra-1",
			"x11y14": "water-1",
			"x12y14": "terra-1",
			"x13y14": "water-1",
			"x14y14": "terra-1",
			"x15y14": "road-1",
			"x16y14": "terra-1",
			"x0y15": "bridge-2",
			"x1y15": "terra-1",
			"x2y15": "road-1",
			"x3y15": "terra-1",
			"x4y15": "road-1",
			"x5y15": "terra-1",
			"x6y15": "road-1",
			"x7y15": "terra-1",
			"x8y15": "road-1",
			"x9y15": "terra-1",
			"x10y15": "road-1",
			"x11y15": "terra-1",
			"x12y15": "road-1",
			"x13y15": "terra-1",
			"x14y15": "road-1",
			"x15y15": "terra-1",
			"x16y15": "bridge-2",
			"x0y16": "road-1",
			"x1y16": "bridge-1",
			"x2y16": "terra-1",
			"x3y16": "bridge-1",
			"x4y16": "terra-1",
			"x5y16": "bridge-1",
			"x6y16": "terra-1",
			"x7y16": "bridge-1",
			"x8y16": "terra-1",
			"x9y16": "bridge-1",
			"x10y16": "terra-1",
			"x11y16": "bridge-1",
			"x12y16": "terra-1",
			"x13y16": "bridge-1",
			"x14y16": "terra-1",
			"x15y16": "bridge-1",
			"x16y16": "road-1"
		}
	};

}(window));