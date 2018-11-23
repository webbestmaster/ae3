// @flow

import type {MapType, MapUserType} from '../../../maps/type';
import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './unit/unit';
import {Unit} from './unit/unit';

function getUnitListByPlayerId(gameData: GameDataType, activeUserId: string): Array<Unit> {
    return gameData.unitList.filter((unit: Unit): boolean => unit.getUserId() === activeUserId);
}

function getEnemyUnitListByPlayerId(gameData: GameDataType, activeUserId: string): Array<Unit> {
    const playerData =
        gameData.userList.find((userData: MapUserType): boolean => userData.userId === activeUserId) || null;

    if (playerData === null) {
        console.error('can not find user by id', activeUserId);
        return [];
    }

    const {teamId} = playerData;

    const enemyPlayerDataList = gameData.userList.filter(
        (userData: MapUserType): boolean => userData.teamId !== teamId
    );

    const enemyPlayerIdList = enemyPlayerDataList.map((userData: MapUserType): string => userData.userId);

    return gameData.unitList.filter((unit: Unit): boolean => enemyPlayerIdList.includes(unit.getUserId()));
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

type UnitAvailableActionType = {|
    +move: UnitActionMoveType | null,
    +actionMap: UnitActionsMapType,
|};

function getUnitActionMapList(unit: Unit, gameData: GameDataType): Array<UnitAvailableActionType> | null {
    const actionMap = unit.getActions(gameData);

    if (actionMap === null) {
        return null;
    }

    const actionMapList = [{move: null, actionMap}];

    getMoveActionList(unit, actionMap).forEach((actionMove: UnitActionMoveType) => {
        const actionMapAfterMove = getActionMapAfterMove(unit, actionMove, gameData);

        if (actionMapAfterMove === null) {
            return;
        }

        // actionMapList.push([actionMove, actionMapAfterMove]);
        actionMapList.push({
            move: actionMove,
            actionMap: actionMapAfterMove,
        });
    });

    return actionMapList;
}

// function getEnemyUnitActionMapList(
//     unit: Unit,
//     gameData: GameDataType
// ): Array<[UnitActionMoveType | null, UnitActionsMapType]> | null {
//     const actionMap = unit.getActions(gameData);
//
//     if (actionMap === null) {
//         return null;
//     }
//
//     const actionMapList = [[null, actionMap]];
//
//     getMoveActionList(unit, actionMap).forEach((actionMove: UnitActionMoveType) => {
//         const emptyUnitListGameData = {...gameData, unitList: [unit]};
//
//         const actionMapAfterMove = getActionMapAfterMove(unit, actionMove, emptyUnitListGameData);
//
//         if (actionMapAfterMove === null) {
//             return;
//         }
//
//         actionMapList.push([actionMove, actionMapAfterMove]);
//     });
//
//     return actionMapList;
// }

type UnitAllActionsMapType = {|
    +unit: Unit,
    +unitActionsMapList: Array<UnitAvailableActionType> | null,
|};

// TODO: get enemy unit available path (remove self unit from map for this)
// TODO: and make available path map and available attack map
export function getBotTurnData(map: MapType, gameData: GameDataType): mixed | null {
    console.log('getBotTurnData map', map);

    const unitList = getUnitListByPlayerId(gameData, map.activeUserId);

    console.log('getBotTurnData unitList', unitList);

    const enemyUnitList = getEnemyUnitListByPlayerId(gameData, map.activeUserId);

    console.log('getBotTurnData enemyUnitList', enemyUnitList);

    const unitAllActionsMapList = unitList
        .map((unit: Unit): UnitAllActionsMapType => ({unit, unitActionsMapList: getUnitActionMapList(unit, gameData)}))
        .filter((unitAllActionsMap: UnitAllActionsMapType): boolean => unitAllActionsMap.unitActionsMapList !== null);

    console.log('getBotTurnData unitAllActionsMapList', unitAllActionsMapList);

    // const enemyUnitAllActionsMapList = enemyUnitList.map(
    //     (unit: Unit): UnitAllActionsMapType => {
    //         return {
    //             unit,
    //             unitActionsMapList: getEnemyUnitActionMapList(unit, gameData),
    //         };
    //     }
    // );

    // console.log('getBotTurnData enemyUnitAllActionsMapList', enemyUnitAllActionsMapList);

    return null;
}
