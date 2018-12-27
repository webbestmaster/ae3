// @flow

import type {MapType, MapUserType, UnitType} from '../../../maps/type';
import type {GameDataType, UnitActionMoveType, UnitActionsMapType, UnitActionType} from './unit/unit';
import {Unit} from './unit/unit';
import {rateBotResultActionData} from './bot-helper';
import {Building} from './building/building';
import {isCommanderLive} from './helper';
import * as serverApi from '../../../module/server-api';
import {messageConst} from '../../../lib/local-server/room/message-const';
import type {UnitTypeCommanderType, UnitTypeCommonType} from './unit/unit-guide';
import {unitGuideData} from './unit/unit-guide';

function getUnitListByPlayerId(gameData: GameDataType, activeUserId: string): Array<Unit> {
    return gameData.unitList.filter((unit: Unit): boolean => unit.getUserId() === activeUserId);
}

function getEnemyUnitListForPlayerId(gameData: GameDataType, activeUserId: string): Array<Unit> {
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

function getActionByName(actionMap: UnitActionsMapType, actionType: string | null): Array<UnitActionType> {
    const moveActionList = [];

    actionMap.forEach((actionListList: Array<Array<UnitActionType>>) => {
        actionListList.forEach((actionList: Array<UnitActionType>) => {
            actionList.forEach((action: UnitActionType) => {
                if (actionType === null || actionType === action.type) {
                    moveActionList.push(action);
                }
            });
        });
    });

    return moveActionList;
}

function getMoveActionList(actionMap: UnitActionsMapType): Array<UnitActionMoveType> {
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

type UnitAvailableActionsMapType = {|
    +moveAction: {|
        +action: UnitActionMoveType | null,
        +actionsMap: UnitActionsMapType | null,
    |},
    +actionsMap: UnitActionsMapType | null,
|};

function getUnitAvailableActionsMapList(unit: Unit, gameData: GameDataType): Array<UnitAvailableActionsMapType> | null {
    const actionsMap = unit.getActions(gameData);

    if (actionsMap === null) {
        return null;
    }

    const actionMapList = [
        {
            moveAction: {
                action: null,
                actionsMap: null,
            },
            actionsMap,
        },
    ];

    getMoveActionList(actionsMap).forEach((actionMove: UnitActionMoveType) => {
        actionMapList.push({
            moveAction: {
                action: actionMove,
                actionsMap,
            },
            actionsMap: null,
        });

        const actionMapAfterMove = getActionMapAfterMove(unit, actionMove, gameData);

        if (actionMapAfterMove === null) {
            return;
        }

        actionMapList.push({
            moveAction: {
                action: actionMove,
                actionsMap,
            },
            actionsMap: actionMapAfterMove,
        });
    });

    return actionMapList;
}

// eslint-disable-next-line id-length
function getEnemyUnitAvailableActionsMapList(
    unit: Unit,
    gameData: GameDataType
): Array<UnitAvailableActionsMapType> | null {
    return getUnitAvailableActionsMapList(unit, {...gameData, unitList: [unit]});
}

export type BotResultActionDataType = {|
    +unit: Unit,
    +moveAction: {|
        +action: UnitActionMoveType | null,
        +actionsMap: UnitActionsMapType | null,
    |},
    +unitAction: UnitActionType | null,
    +armorMap: {|
        +walk: Array<Array<number>>,
        +flow: Array<Array<number>>,
        +fly: Array<Array<number>>,
    |},
|};

type UnitAllAvailableActionsMapType = {|
    +unit: Unit,
    +availableActionsMapList: Array<UnitAvailableActionsMapType> | null,
|};

export type EnemyUnitAllAvailableActionsMapType = {|
    +unit: Unit,
    +availableActionsMapList: Array<UnitAvailableActionsMapType> | null,
    +damageMap: Array<Array<number | null>>,
|};

function getBotActionDataList(
    unitAllActionsMapList: Array<UnitAllAvailableActionsMapType>,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): Array<BotResultActionDataType> {
    const botResultActionDataList = [];
    const {armorMap} = gameData;

    unitAllActionsMapList.forEach((unitAllActionsMap: UnitAllAvailableActionsMapType) => {
        const {unit, availableActionsMapList} = unitAllActionsMap;

        if (availableActionsMapList === null) {
            return;
        }

        availableActionsMapList.forEach((unitActionsMap: UnitAvailableActionsMapType) => {
            const {actionsMap, moveAction} = unitActionsMap;

            botResultActionDataList.push({unit, moveAction, unitAction: null, armorMap});

            if (actionsMap === null) {
                return;
            }

            getActionByName(actionsMap, null).forEach((unitAction: UnitActionType) => {
                // no need to open store
                if (unitAction.type === 'open-store') {
                    return;
                }

                // no need to move, moveAction exists in botActionData yet
                if (unitAction.type === 'move') {
                    return;
                }

                botResultActionDataList.push({unit, moveAction, unitAction, armorMap});
            });
        });
    });

    return botResultActionDataList.sort(
        (botResultA: BotResultActionDataType, botResultB: BotResultActionDataType): number => {
            return (
                rateBotResultActionData(botResultB, enemyUnitAllActionsMapList, gameData) -
                rateBotResultActionData(botResultA, enemyUnitAllActionsMapList, gameData)
            );
        }
    );
}

// TODO: get enemy unit available path (remove self unit from map for this)
// TODO: and make available path map and available attack map
export function getBotTurnDataList(map: MapType, gameData: GameDataType): Array<BotResultActionDataType> | null {
    console.log('getBotTurnData map', map);

    const enemyUnitList = getEnemyUnitListForPlayerId(gameData, map.activeUserId);

    console.log('getBotTurnData enemyUnitList', enemyUnitList);

    const enemyUnitAllActionsMapList = enemyUnitList.map(
        (unit: Unit): EnemyUnitAllAvailableActionsMapType => {
            const availableActionsMapList = getEnemyUnitAvailableActionsMapList(unit, gameData);

            const damageMap = unit.getAvailableDamageMap({...gameData, unitList: [unit]});

            return {unit, availableActionsMapList, damageMap};
        }
    );

    console.log('getBotTurnData enemyUnitAllActionsMapList', enemyUnitAllActionsMapList);

    const unitList = getUnitListByPlayerId(gameData, map.activeUserId);

    console.log('getBotTurnData unitList', unitList);

    const unitAllActionsMapList = unitList.map(
        (unit: Unit): UnitAllAvailableActionsMapType => ({
            unit,
            availableActionsMapList: getUnitAvailableActionsMapList(unit, gameData),
        })
    );

    console.log('getBotTurnData unitAllActionsMapList', unitAllActionsMapList);

    const bestBotActionDataList = getBotActionDataList(unitAllActionsMapList, enemyUnitAllActionsMapList, gameData);

    if (bestBotActionDataList.length > 0) {
        return bestBotActionDataList;
    }

    return null;
}

function getStoreList(activeUserId: string, gameData: GameDataType): Array<Building> | null {
    const castleList = gameData.buildingList.filter(
        (buildingInList: Building): boolean => {
            const buildingInListAttr = buildingInList.attr;

            if (buildingInListAttr.type !== 'castle') {
                return false;
            }

            if (buildingInListAttr.userId !== activeUserId) {
                return false;
            }

            const unitOnStore =
                gameData.unitList.find(
                    (unitInList: Unit): boolean => {
                        return unitInList.attr.x === buildingInListAttr.x && unitInList.attr.y === buildingInListAttr.y;
                    }
                ) || null;

            // if on store stay NO unit - buy unit
            return unitOnStore === null;
        }
    );

    return castleList.length === 0 ? null : castleList;
}

function getStoreToBuyUnit(activeUserId: string, gameData: GameDataType): Building | null {
    const storeList = getStoreList(activeUserId, gameData);

    if (storeList === null) {
        return null;
    }

    return storeList.sort((): number => Math.random() - 0.5)[0];
}

// eslint-disable-next-line complexity
function getUnitTypeToBuy(
    activeUserId: string,
    gameData: GameDataType,
    mapState: MapType
): UnitTypeCommonType | UnitTypeCommanderType | null {
    const playerData =
        gameData.userList.find((userInList: MapUserType): boolean => userInList.userId === activeUserId) || null;

    if (playerData === null) {
        console.error('getUnitTypeToBuy - can not find user with id:', activeUserId, gameData);
        return null;
    }

    const hasCommander = isCommanderLive(playerData.userId, mapState);

    if (hasCommander === false) {
        return playerData.commander ? playerData.commander.type : 'galamar';
    }

    const soldierList = gameData.unitList.filter(
        (unitInList: Unit): boolean => {
            const {userId, type} = unitInList.attr;

            return type === 'soldier' && userId === activeUserId;
        }
    );

    if (soldierList.length < 2) {
        return 'soldier';
    }

    const archerList = gameData.unitList.filter(
        (unitInList: Unit): boolean => {
            const {userId, type} = unitInList.attr;

            return type === 'archer' && userId === activeUserId;
        }
    );

    if (archerList.length < 2) {
        return 'archer';
    }

    return ['sorceress', 'golem', 'catapult', 'dire-wolf', 'wisp'].sort((): number => Math.random() - 0.5)[0];
}

export function canPlayerBuyUnit(activeUserId: string, gameData: GameDataType): boolean {
    // get players castle list
    // get castle list to open
    // check unit limit

    const playerData =
        gameData.userList.find((userInList: MapUserType): boolean => userInList.userId === activeUserId) || null;

    if (playerData === null) {
        console.error('canPlayerBuyUnit - can not find user with id:', activeUserId, gameData);
        return false;
    }

    if (getStoreList(activeUserId, gameData) === null) {
        return false;
    }

    const playerUnitList = gameData.unitList.filter(
        (unitInList: Unit): boolean => unitInList.attr.userId === activeUserId
    );

    return playerUnitList.length < gameData.unitLimit;
}

// eslint-disable-next-line complexity
export async function botBuyUnit(
    activeUserId: string,
    gameData: GameDataType,
    mapState: MapType,
    roomId: string
): Promise<UnitType | Error | null> {
    const newMapState: MapType = JSON.parse(JSON.stringify(mapState));
    const playerData =
        newMapState.userList.find((userInList: MapUserType): boolean => userInList.userId === activeUserId) || null;

    if (playerData === null) {
        console.error('botBuyUnit - can not find user with id:', activeUserId, gameData);
        return null;
    }

    const storeToBuyUnit = getStoreToBuyUnit(activeUserId, gameData);

    if (storeToBuyUnit === null) {
        return null;
    }

    const newUnitX = storeToBuyUnit.attr.x;
    const newUnitY = storeToBuyUnit.attr.y;

    const newUnitType = getUnitTypeToBuy(activeUserId, gameData, newMapState);

    if (newUnitType === null) {
        return null;
    }

    const unitData = unitGuideData[newUnitType];

    if (playerData.money < unitData.cost) {
        return null;
    }

    playerData.money -= unitData.cost;

    const newMapUnitData: UnitType = {
        type: newUnitType,
        x: newUnitX,
        y: newUnitY,
        userId: activeUserId,
        id: [newUnitX, newUnitY, Math.random()].join('-'),
    };

    newMapState.units.push(newMapUnitData);

    return serverApi
        .pushState(roomId, activeUserId, {
            type: messageConst.type.pushState,
            state: {
                type: 'buy-unit',
                newMapUnit: newMapUnitData,
                map: newMapState,
                activeUserId,
            },
        })
        .then(
            (response: mixed): UnitType => {
                console.log('---> user action buy unit', response);

                return newMapUnitData;
            }
        )
        .catch(
            (error: Error): Error => {
                console.error('store-push-state error');
                console.log(error);

                return error;
            }
        );
}
