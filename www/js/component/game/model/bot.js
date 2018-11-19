// @flow

import type {MapType} from '../../../maps/type';
import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './unit/unit';
import {Unit} from './unit/unit';

function getUnitListByPlayerId(gameData: GameDataType, activeUserId: string): Array<Unit> {
    return gameData.unitList.filter((unit: Unit): boolean => unit.getUserId() === activeUserId);
}

function getMoveActionList(unit: Unit, actionMap: UnitActionsMapType): Array<UnitActionMoveType> {
    const moveActionList = [];

    actionMap.forEach((actionListList: Array<Array<UnitActionType>>) => {
        actionListList.forEach((actionList: Array<UnitActionType>) => {
            actionList.forEach((action: UnitActionType) => {
                if (action.type !== 'move') {
                    return;
                }

                moveActionList.push(action);
            });
        });
    });

    return moveActionList;
}

function getActionMapAfterMove(
    unit: Unit,
    actionMove: UnitActionMoveType,
    gameData: GameDataType
): UnitActionsMapType | null {
    const beforeUnitAttr = unit.getAttr();
    const moveUnitAttr = unit.getAttr();

    moveUnitAttr.x = actionMove.to.x;
    moveUnitAttr.y = actionMove.to.y;

    unit.setAttr(moveUnitAttr);
    unit.setDidMove(true);

    const actionMap = unit.getActions(gameData);

    unit.setAttr(beforeUnitAttr);

    return actionMap;
}

function getUnitActionMapList(unit: Unit, gameData: GameDataType): Array<UnitActionsMapType> | null {
    // 1 - get unit action list // +
    // 2 - filter MOVE action only // +
    // 3 - get action list for every move position
    // 4 - get action list for current position, without move
    // 5 - rate every unit action

    const actionMap = unit.getActions(gameData);

    if (actionMap === null) {
        return null;
    }

    const actionMapList = [actionMap];

    getMoveActionList(unit, actionMap).forEach((actionMove: UnitActionMoveType) => {
        const actionMapAfterMove = getActionMapAfterMove(unit, actionMove, gameData);

        if (actionMapAfterMove === null) {
            return;
        }

        actionMapList.push(actionMapAfterMove);
    });

    return actionMapList;
}

export function getBotTurnData(map: MapType, gameData: GameDataType): mixed | null {
    console.log('getBotTurnData map', map);

    // get unit
    const unitList = getUnitListByPlayerId(gameData, map.activeUserId);

    unitList.forEach((unit: Unit) => {
        // get action uit list
        const unitActionList = getUnitActionMapList(unit, gameData);

        console.log(unitActionList);
    });

    console.log('getBotTurnData unitList', unitList);

    return null;
}
