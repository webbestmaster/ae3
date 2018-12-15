// @flow

/* eslint consistent-this: ["error", "unit", "aggressor"] */

import type {GameDataType, UnitActionsMapType, UnitActionType} from '../unit';
import {Unit} from '../unit';
import type {AvailablePathMapType} from '../path-master';

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

export class Catapult extends Unit {
    getAllAvailableAttack(gameData: GameDataType): AvailablePathMapType {
        const unit = this;
        const {x, y} = unit.attr;

        const disArray = [[0, -1], [-1, 0], [1, 0], [0, 1], [0, 0]].map(
            (coordinates: [number, number]): [number, number] => {
                return [x + coordinates[0], y + coordinates[1]];
            }
        );

        return super.getAllAvailableAttack(gameData).filter(
            (coordinates: [number, number]): boolean => {
                return !disArray.some(
                    (disArrayCoordinates: [number, number]): boolean => {
                        return coordinates[0] === disArrayCoordinates[0] && coordinates[1] === disArrayCoordinates[1];
                    }
                );
            }
        );
    }

    canAttack(defender: Unit): boolean {
        const aggressor = this;
        const range = aggressor.getGuideData().attack.range;

        const coordinatesDifferent =
            Math.abs(defender.attr.x - aggressor.attr.x) + Math.abs(defender.attr.y - aggressor.attr.y);

        return coordinatesDifferent <= range && coordinatesDifferent !== 1;
    }
}
