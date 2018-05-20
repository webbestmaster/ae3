/*jslint white: true, nomen: true */
(function (win) {

    'use strict';
    /*global window, document */
    /*global APP */

    win.APP.maps = win.APP.maps || {};

    win.APP.maps.skirmish_001_023 = {
        version: 1,
        "type": "skirmish",
        "size": {"width": 15, "height": 12},
        "name": "Labyrinth",
        "name-es": "Laberinto",
        "name-ru": "Лабиринт",
        "isOpen": true,
        "maxPlayers": 2,
        "units": [{"x": 14, "y": 0, "type": "commander", "ownerId": 1}, {
            "x": 12,
            "y": 0,
            "type": "catapult",
            "ownerId": 1
        }, {"x": 13, "y": 0, "type": "catapult", "ownerId": 1}, {
            "x": 14,
            "y": 1,
            "type": "catapult",
            "ownerId": 1
        }, {"x": 14, "y": 2, "type": "catapult", "ownerId": 1}, {
            "x": 0,
            "y": 11,
            "type": "commander",
            "ownerId": 0
        }, {"x": 0, "y": 10, "type": "golem", "ownerId": 0}, {"x": 0, "y": 9, "type": "golem", "ownerId": 0}, {
            "x": 0,
            "y": 8,
            "type": "golem",
            "ownerId": 0
        }, {"x": 1, "y": 11, "type": "golem", "ownerId": 0}, {"x": 2, "y": 11, "type": "golem", "ownerId": 0}, {
            "x": 3,
            "y": 11,
            "type": "golem",
            "ownerId": 0
        }],
        "buildings": [{"x": 5, "y": 2, "type": "castle", "state": "normal"}, {
            "x": 7,
            "y": 5,
            "type": "castle",
            "state": "normal"
        }, {"x": 1, "y": 1, "type": "farm", "state": "normal"}, {
            "x": 1,
            "y": 2,
            "type": "farm",
            "state": "normal"
        }, {"x": 1, "y": 3, "type": "farm", "state": "normal"}, {
            "x": 2,
            "y": 1,
            "type": "farm",
            "state": "normal"
        }, {"x": 3, "y": 1, "type": "farm", "state": "normal"}, {
            "x": 7,
            "y": 1,
            "type": "farm",
            "state": "normal"
        }, {"x": 13, "y": 8, "type": "farm", "state": "normal"}, {
            "x": 13,
            "y": 9,
            "type": "farm",
            "state": "normal"
        }, {"x": 13, "y": 10, "type": "farm", "state": "normal"}, {
            "x": 12,
            "y": 10,
            "type": "farm",
            "state": "normal"
        }, {"x": 11, "y": 10, "type": "farm", "state": "normal"}, {
            "x": 2,
            "y": 2,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 8, "y": 1, "type": "farm", "state": "destroyed"}, {
            "x": 13,
            "y": 4,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 11, "y": 5, "type": "farm", "state": "destroyed"}, {
            "x": 12,
            "y": 9,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 0, "y": 11, "type": "castle", "state": "normal", "ownerId": 0}, {
            "x": 2,
            "y": 9,
            "type": "farm",
            "state": "normal",
            "ownerId": 0
        }, {"x": 5, "y": 10, "type": "farm", "state": "normal", "ownerId": 0}, {
            "x": 6,
            "y": 10,
            "type": "farm",
            "state": "normal",
            "ownerId": 0
        }, {"x": 7, "y": 10, "type": "farm", "state": "normal", "ownerId": 0}, {
            "x": 14,
            "y": 11,
            "type": "farm",
            "state": "destroyed"
        }, {"x": 0, "y": 0, "type": "farm", "state": "destroyed"}, {
            "x": 14,
            "y": 0,
            "type": "castle",
            "state": "normal",
            "ownerId": 1
        }, {"x": 13, "y": 1, "type": "farm", "state": "normal", "ownerId": 1}, {
            "x": 13,
            "y": 2,
            "type": "farm",
            "state": "normal",
            "ownerId": 1
        }, {"x": 11, "y": 0, "type": "farm", "state": "normal", "ownerId": 1}, {
            "x": 11,
            "y": 1,
            "type": "farm",
            "state": "normal",
            "ownerId": 1
        }],
        "terrain": {
            "x0y0": "terra-1",
            "x0y1": "road-1",
            "x0y2": "road-1",
            "x0y3": "road-1",
            "x0y4": "road-1",
            "x0y5": "road-1",
            "x0y6": "road-1",
            "x0y7": "road-1",
            "x0y8": "road-1",
            "x0y9": "road-1",
            "x0y10": "road-1",
            "x1y0": "road-1",
            "x1y1": "terra-1",
            "x1y2": "terra-1",
            "x1y3": "terra-1",
            "x1y4": "stone-1",
            "x1y5": "stone-1",
            "x1y6": "stone-1",
            "x1y7": "road-1",
            "x1y8": "stone-1",
            "x1y9": "stone-1",
            "x1y10": "stone-1",
            "x2y0": "road-1",
            "x2y1": "terra-1",
            "x2y2": "terra-1",
            "x2y3": "stone-1",
            "x2y4": "stone-1",
            "x2y5": "water-1",
            "x2y6": "water-1",
            "x2y7": "road-1",
            "x2y8": "stone-1",
            "x2y9": "terra-1",
            "x2y10": "stone-1",
            "x3y0": "road-1",
            "x3y1": "terra-1",
            "x3y2": "water-1",
            "x3y3": "stone-1",
            "x3y4": "road-1",
            "x3y5": "road-1",
            "x3y6": "road-1",
            "x3y7": "road-1",
            "x3y8": "stone-1",
            "x3y9": "stone-1",
            "x3y10": "stone-1",
            "x4y0": "road-1",
            "x4y1": "stone-1",
            "x4y2": "water-1",
            "x4y3": "stone-1",
            "x4y4": "road-1",
            "x4y5": "water-1",
            "x4y6": "water-1",
            "x4y7": "water-1",
            "x4y8": "water-1",
            "x4y9": "road-1",
            "x4y10": "road-1",
            "x5y0": "road-1",
            "x5y1": "stone-1",
            "x5y2": "road-1",
            "x5y3": "stone-1",
            "x5y4": "road-1",
            "x5y5": "water-1",
            "x5y6": "water-1",
            "x5y7": "water-1",
            "x5y8": "road-1",
            "x5y9": "road-1",
            "x5y10": "terra-1",
            "x6y0": "road-1",
            "x6y1": "road-1",
            "x6y2": "road-1",
            "x6y3": "stone-1",
            "x6y4": "road-1",
            "x6y5": "road-1",
            "x6y6": "road-1",
            "x6y7": "stone-1",
            "x6y8": "road-1",
            "x6y9": "stone-1",
            "x6y10": "terra-1",
            "x7y0": "road-1",
            "x7y1": "terra-1",
            "x7y2": "road-1",
            "x7y3": "stone-1",
            "x7y4": "stone-1",
            "x7y5": "road-1",
            "x7y6": "road-1",
            "x7y7": "road-1",
            "x7y8": "road-1",
            "x7y9": "stone-1",
            "x7y10": "terra-1",
            "x8y0": "road-1",
            "x8y1": "terra-1",
            "x8y2": "road-1",
            "x8y3": "road-1",
            "x8y4": "road-1",
            "x8y5": "road-1",
            "x8y6": "road-1",
            "x8y7": "stone-1",
            "x8y8": "road-1",
            "x8y9": "road-1",
            "x8y10": "road-1",
            "x9y0": "road-1",
            "x9y1": "stone-1",
            "x9y2": "stone-1",
            "x9y3": "water-1",
            "x9y4": "water-1",
            "x9y5": "water-1",
            "x9y6": "water-1",
            "x9y7": "stone-1",
            "x9y8": "road-1",
            "x9y9": "water-1",
            "x9y10": "stone-1",
            "x10y0": "road-1",
            "x10y1": "road-1",
            "x10y2": "road-1",
            "x10y3": "stone-1",
            "x10y4": "water-1",
            "x10y5": "water-1",
            "x10y6": "water-1",
            "x10y7": "stone-1",
            "x10y8": "road-1",
            "x10y9": "water-1",
            "x10y10": "stone-1",
            "x11y0": "terra-1",
            "x11y1": "terra-1",
            "x11y2": "road-1",
            "x11y3": "stone-1",
            "x11y4": "water-1",
            "x11y5": "terra-1",
            "x11y6": "road-1",
            "x11y7": "road-1",
            "x11y8": "road-1",
            "x11y9": "stone-1",
            "x11y10": "terra-1",
            "x12y0": "road-1",
            "x12y1": "road-1",
            "x12y2": "road-1",
            "x12y3": "stone-1",
            "x12y4": "water-1",
            "x12y5": "road-1",
            "x12y6": "road-1",
            "x12y7": "stone-1",
            "x12y8": "stone-1",
            "x12y9": "terra-1",
            "x12y10": "terra-1",
            "x13y0": "road-1",
            "x13y1": "terra-1",
            "x13y2": "terra-1",
            "x13y3": "water-1",
            "x13y4": "terra-1",
            "x13y5": "road-1",
            "x13y6": "water-1",
            "x13y7": "stone-1",
            "x13y8": "terra-1",
            "x13y9": "terra-1",
            "x13y10": "terra-1",
            "x14y0": "road-1",
            "x14y1": "road-1",
            "x14y2": "road-1",
            "x14y3": "road-1",
            "x14y4": "road-1",
            "x14y5": "road-1",
            "x14y6": "road-1",
            "x14y7": "road-1",
            "x14y8": "road-1",
            "x14y9": "road-1",
            "x14y10": "road-1",
            "x0y11": "road-1",
            "x1y11": "road-1",
            "x2y11": "road-1",
            "x3y11": "road-1",
            "x4y11": "road-1",
            "x5y11": "road-1",
            "x6y11": "road-1",
            "x7y11": "road-1",
            "x8y11": "road-1",
            "x9y11": "road-1",
            "x10y11": "road-1",
            "x11y11": "road-1",
            "x12y11": "road-1",
            "x13y11": "road-1",
            "x14y11": "terra-1"
        }
    };

}(window));