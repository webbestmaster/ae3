// @flow
import Unit from './../index';
import type {GameDataType, UnitActionsMapType, UnitActionType} from './../index';

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

export default class UnitCustom extends Unit {
    getActions(gameData: GameDataType): UnitActionsMapType | null {
        const unit = this; // eslint-disable-line consistent-this

        if (unit.getDidMove()) {
            return null;
        }

        return super.getActions(gameData);
    }

    getAttackActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this; // eslint-disable-line consistent-this
        const startX = unit.attr.x;
        const startY = unit.attr.y;
        const superUnitActionMap = super.getAttackActions(gameData);

        let ii = 0;
        const disArray = [0, -1, -1, 0, 1, 0, 0, 1];
        const disArrayLength = disArray.length;

        for (; ii < disArrayLength; ii += 2) {
            const x = startX + disArray[ii];
            const y = startY + disArray[ii + 1];

            const cell = getCell(x, y, superUnitActionMap);

            if (cell !== null) {
                superUnitActionMap[y][x] = [];
            }
        }

        return superUnitActionMap;
    }

    getDestroyBuildingActions(gameData: GameDataType): UnitActionsMapType {
        const unit = this; // eslint-disable-line consistent-this
        const startX = unit.attr.x;
        const startY = unit.attr.y;
        const superUnitActionMap = super.getDestroyBuildingActions(gameData);

        let ii = 0;
        const disArray = [0, -1, -1, 0, 1, 0, 0, 1, 0, 0];
        const disArrayLength = disArray.length;

        for (; ii < disArrayLength; ii += 2) {
            const x = startX + disArray[ii];
            const y = startY + disArray[ii + 1];

            const cell = getCell(x, y, superUnitActionMap);

            console.log(cell);

            if (cell !== null) {
                superUnitActionMap[y][x] = [];
            }
        }

        return superUnitActionMap;
    }
}
