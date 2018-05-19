// @flow

/* eslint consistent-this: ["error", "unit", "aggressor"] */

import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './../index';
import Unit from './../index';
import {getMoviePath} from './../../helper';
import type {PathType} from './../../../../../lib/a-star-finder';
import type {AvailablePathMapType} from './../path-master';

function getCell(x: number, y: number, map: UnitActionsMapType): Array<UnitActionType> | null {
    const line = getLine(y, map);

    if (line === null) {
        return null;
    }

    return getItemOfLine(x, line);
}

function getLine(index: number, map: UnitActionsMapType): Array<Array<UnitActionType>> | null {
    if (index >= 0 && index < map.length) {
        return map[index];
    }

    return null;
}

function getItemOfLine(index: number, line: Array<Array<UnitActionType>>): Array<UnitActionType> | null {
    if (index >= 0 && index < line.length) {
        return line[index];
    }

    return null;
}

export default class Catapult extends Unit {
    getActions(gameData: GameDataType): UnitActionsMapType | null {
        const unit = this;

        if (unit.getDidMove()) {
            return null;
        }

        return super.getActions(gameData);
    }

    getAllAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this;
        const {x, y, type} = unit.attr;

        console.log('catapult');

        const disArray = [[0, -1], [-1, 0], [1, 0], [0, 1], [0, 0]]
            .map((coordinates: [number, number]): [number, number] => {
                return [x + coordinates[0], y + coordinates[1]];
            });

        const allAvailableAttack = super.getAllAvailableAttack(gameData)
            .filter((coordinates: [number, number]): boolean => {
                return !disArray.some((disArrayCoordinates: [number, number]): boolean => {
                    return coordinates[0] === disArrayCoordinates[0] && coordinates[1] === disArrayCoordinates[1];
                });
            });

        return allAvailableAttack;
    }

    getMoviePath(unitAction: UnitActionMoveType,
                 actionsList: UnitActionsMapType,
                 gameData?: GameDataType): PathType | null {
        if (!gameData) {
            console.error('gameData is needed');
            return null;
        }

        const moveActionList = super.getMoveActions(gameData);

        return getMoviePath(unitAction, moveActionList);
    }

    canAttack(defender: Unit): boolean {
        const aggressor = this;
        const range = aggressor.getGuideData().attack.range;

        const coordinatesDifferent = Math.abs(defender.attr.x - aggressor.attr.x) +
            Math.abs(defender.attr.y - aggressor.attr.y);

        return coordinatesDifferent <= range && coordinatesDifferent !== 1;
    }
}
