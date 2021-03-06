// @flow

import type {BotResultActionDataType, EnemyUnitAllAvailableActionsMapType} from './bot';
import {defaultUnitData, unitGuideData} from './unit/unit-guide';
import {Building} from './building/building';
import type {GameDataType} from './unit/unit';
import {Unit} from './unit/unit';
import type {MapUserType} from '../../../maps/type';
import type {TeamIdType} from '../../../maps/map-guide';

type PointType = {|
    +x: number,
    +y: number,
|};

const actionTypeName = {
    destroyBuilding: 'destroy-building',
    occupyBuilding: 'occupy-building',
};

export type RawRateType = {|
    hitPoints: number,
    // done
    +attack: {|
        +damageGiven: number, // done
        +damageReceived: number, // done
        +hitPoints: number, // done
    |},

    // done
    +unit: {|
        // done
        +endPosition: {|
            +x: number, // done
            +y: number, // done
        |},
        // hitPoints: number, // done // unit with bigger hp has priority, to attack and move on front
    |},

    // use together: placeArmor and availableDamageGiven
    +placeArmor: number, // done
    +availableGivenDamage: number, // done

    /*
     *
     * castle or farm, will stimulate unit to move ahead
     * count path size to building from current position (f. e. 14)
     * count path size to building from new position (f. e. 9)
     * count diff - 14 - 9 = 5
     * direction (place) to nearest building has bigger diff
     * use this logic if building is NOT reached only
     * not reached count in percent of whole path size
     *
     * */
    +madePathToNearOccupyAbleBuilding: number, // done // if reached -> madePathSize, else -> percent of needed path
    +isReachedNearOccupyAbleBuilding: boolean, // done
    +madePathToNearHealsBuilding: number, // done // use if unit has < 50hp
    +isReachedToNearHealsBuilding: boolean, // done // use if unit has < 50hp

    +canRaiseSkeleton: boolean, // done

    // farm
    +canFixFarm: boolean, // done
    +canOccupyEnemyFarm: boolean, // done
    +canOccupyEnemyCastle: boolean, // done
    +canOccupyNoManFarm: boolean, // done
    +canOccupyNoManCastle: boolean, // done
    +canDestroyEnemyFarm: boolean, // done
    +canLeaveToOccupyBuilding: boolean, // done
    +canLeaveFromUnitUnderUnit: boolean, // done
    // +isLastBuilding: boolean, // done
    +isAllBuildingsOccupied: boolean, // done
    // +canDestroyNoManFarm: boolean,  // will not be done // catapult can not destroy no man's farm

    +isOnHealsBuilding: boolean, // in progress
    +isOnSelfBuilding: boolean, // in progress
    +isOnTeamBuilding: boolean, // in progress
    +isOnEnemyBuilding: boolean, // in progress

    +canPreventEnemyFixFarm: boolean, // not used yet - in progress
    +canPreventEnemyOccupyNoManFarm: boolean, // not used yet - in progress
    +canPreventEnemyOccupyMyFarm: boolean, // not used yet - in progress
    +canPreventEnemyOccupyMyTeamFarm: boolean, // not used yet - in progress

    +canPreventEnemyOccupyNoManCastle: boolean, // not used yet - in progress
    +canPreventEnemyOccupyMyCastle: boolean, // not used yet - in progress
    +canPreventEnemyOccupyMyTeamCastle: boolean, // not used yet - in progress
|};

const defaultRawRate: RawRateType = {
    hitPoints: defaultUnitData.hitPoints, // do not use it, just for floe type
    attack: {
        damageGiven: 0,
        damageReceived: 0,
        hitPoints: defaultUnitData.hitPoints,
    },
    unit: {
        endPosition: {
            x: -1,
            y: -1,
        },
        // hitPoints: defaultUnitData.hitPoints,
    },
    placeArmor: 0,
    availableGivenDamage: 0,
    madePathToNearOccupyAbleBuilding: 0,
    isReachedNearOccupyAbleBuilding: false,
    madePathToNearHealsBuilding: 0,
    isReachedToNearHealsBuilding: false,
    canRaiseSkeleton: false,
    canFixFarm: false,
    canLeaveToOccupyBuilding: false,
    canOccupyEnemyFarm: false,
    canOccupyEnemyCastle: false,
    canOccupyNoManFarm: false,
    canOccupyNoManCastle: false,
    canDestroyEnemyFarm: false,
    canLeaveFromUnitUnderUnit: false,
    // isLastBuilding: false,
    isAllBuildingsOccupied: false,

    isOnHealsBuilding: false,
    isOnSelfBuilding: false,
    isOnTeamBuilding: false,
    isOnEnemyBuilding: false,

    canPreventEnemyFixFarm: false,
    canPreventEnemyOccupyNoManFarm: false,
    canPreventEnemyOccupyMyFarm: false,
    canPreventEnemyOccupyMyTeamFarm: false,
    canPreventEnemyOccupyNoManCastle: false,
    canPreventEnemyOccupyMyCastle: false,
    canPreventEnemyOccupyMyTeamCastle: false,
};

// eslint-disable-next-line complexity
function getCanOccupyEnemyBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType,
    buildingType: 'farm' | 'castle'
): boolean {
    const {unitAction, unit} = botResultActionData;

    if (!unitAction) {
        return false;
    }

    if (unitAction.type !== actionTypeName.occupyBuilding) {
        return false;
    }

    const building =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => {
                return buildingInList.attr.x === unitAction.x && buildingInList.attr.y === unitAction.y;
            }
        ) || null;

    if (building === null) {
        console.error('getCanOccupyEnemyFarm - can not find building with for', botResultActionData, gameData);
        return false;
    }

    // check building is farm
    if (building.attr.type !== buildingType) {
        return false;
    }

    // check farm has owner
    if (typeof building.attr.userId !== 'string') {
        return false;
    }

    const buildingTeamId = getTeamIdByUserId(building.attr.userId, gameData);

    if (buildingTeamId === null) {
        return false;
    }

    const unitTeamId = getTeamIdByUserId(unit.getUserId() || '', gameData);

    return unitTeamId !== buildingTeamId;
}

// eslint-disable-next-line complexity
function getCanOccupyNaManBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType,
    buildingType: 'farm' | 'castle'
): boolean {
    const {unitAction} = botResultActionData;

    if (!unitAction) {
        return false;
    }

    if (unitAction.type !== actionTypeName.occupyBuilding) {
        return false;
    }

    const building =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => {
                return buildingInList.attr.x === unitAction.x && buildingInList.attr.y === unitAction.y;
            }
        ) || null;

    if (building === null) {
        console.error('getCanOccupyNaManFarm - can not find building with for', botResultActionData, gameData);
        return false;
    }

    // check building is farm
    if (building.attr.type !== buildingType) {
        return false;
    }

    // check farm has owner
    return typeof building.attr.userId !== 'string' || building.attr.userId === '';
}

// eslint-disable-next-line complexity
function getCanDestroyEnemyBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType,
    buildingType: 'farm' | 'castle'
): boolean {
    const {unitAction, unit} = botResultActionData;

    if (!unitAction) {
        return false;
    }

    if (unitAction.type !== actionTypeName.destroyBuilding) {
        return false;
    }

    const building =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => {
                return (
                    buildingInList.attr.x === unitAction.building.x && buildingInList.attr.y === unitAction.building.y
                );
            }
        ) || null;

    if (building === null) {
        console.error('getCanDestroyEnemyFarm - can not find building with for', botResultActionData, gameData);
        return false;
    }

    // check building is farm
    if (building.attr.type !== buildingType) {
        return false;
    }

    // check farm has owner
    if (typeof building.attr.userId !== 'string') {
        return false;
    }

    const buildingTeamId = getTeamIdByUserId(building.attr.userId, gameData);

    if (buildingTeamId === null) {
        return false;
    }

    const unitTeamId = getTeamIdByUserId(unit.getUserId() || '', gameData);

    return unitTeamId !== buildingTeamId;
}

function getCanLeaveFromUnitUnderUnit(botResultActionData: BotResultActionDataType, gameData: GameDataType): boolean {
    const {unit} = botResultActionData;
    const {x, y} = unit.attr;

    const unitList = gameData.unitList.filter(
        (unitInList: Unit): boolean => {
            return unitInList.attr.x === x && unitInList.attr.y === y;
        }
    );

    const unitLength = unitList.length;

    // on current position only one (current) unit
    if (unitLength === 0) {
        console.error('unitList should contain at least one unit');
        return false;
    }

    // on current position only one (current) unit
    if (unitLength === 1) {
        return false;
    }

    const endPoint = getEndPoint(botResultActionData);

    return endPoint.x !== x || endPoint.y !== y;
}

function getTeamIdByUserId(userId: string, gameData: GameDataType): TeamIdType | null {
    const playerData = gameData.userList.find((userData: MapUserType): boolean => userData.userId === userId) || null;

    if (playerData === null) {
        console.log('getTeamIdByUserId - can not find user by id', userId);
        return null;
    }

    return playerData.teamId;
}

// eslint-disable-next-line complexity
function getCanLeaveToOccupyBuilding(botResultActionData: BotResultActionDataType, gameData: GameDataType): boolean {
    const {unit} = botResultActionData;
    const {x, y} = unit.attr;

    const endPoint = getEndPoint(botResultActionData);

    // check unit leave from current position
    if (endPoint.x === x && endPoint.y === y) {
        return false;
    }

    const building =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => buildingInList.attr.x === x && buildingInList.attr.y === y
        ) || null;

    if (building === null) {
        console.log('getCanLeaveToOccupyBuilding - no building under unit');
        return false;
    }

    const currentUnitGuideData = unitGuideData[unit.attr.type];

    if (building.attr.userId === unit.attr.userId) {
        console.log('getCanLeaveToOccupyBuilding - user (bot) already has this building');
        return false;
    }

    if (currentUnitGuideData.occupyBuildingList.includes(building.attr.type)) {
        console.log('getCanLeaveToOccupyBuilding - can occupy this building');
        return false;
    }

    // find near unit to occupy this building
    const nearUnitToOccupyBuildingList = gameData.unitList.filter(
        (unitInList: Unit): boolean => {
            if (unitInList.attr.userId !== unit.attr.userId) {
                return false;
            }

            const currentUnitInListGuideData = unitGuideData[unitInList.attr.type];

            // unit has no occupyBuildingList or not occupy building
            if (!currentUnitInListGuideData.occupyBuildingList.includes(building.attr.type)) {
                return false;
            }

            const deltaX = Math.abs(x - unitInList.attr.x);
            const deltaY = Math.abs(y - unitInList.attr.y);
            const minPathToBuilding = 3;

            return deltaX <= minPathToBuilding && deltaY <= minPathToBuilding;
        }
    );

    return nearUnitToOccupyBuildingList.length > 0;
}

// eslint-disable-next-line complexity, max-statements
function getIsOnBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType
): {|
    +isOnHealsBuilding: boolean,
    +isOnSelfBuilding: boolean,
    +isOnTeamBuilding: boolean,
    +isOnEnemyBuilding: boolean,
|} {
    const defaultResult = {
        isOnHealsBuilding: false,
        isOnSelfBuilding: false,
        isOnTeamBuilding: false,
        isOnEnemyBuilding: false,
    };

    const endPoint = getEndPoint(botResultActionData);
    const {unit} = botResultActionData;
    const activeUserId = unit.getUserId();

    if (activeUserId === null) {
        console.error('getIsOnBuilding - unit has not user id', unit);
        return defaultResult;
    }

    const unitTeamId = getTeamIdByUserId(activeUserId, gameData);

    if (unitTeamId === null) {
        console.error('getIsOnBuilding - can not find user by id', activeUserId);
        return defaultResult;
    }

    const building =
        gameData.buildingList.find(
            (buildingInList: Building): boolean => {
                return buildingInList.attr.x === endPoint.x && buildingInList.attr.y === endPoint.y;
            }
        ) || null;

    if (building === null) {
        console.log('getIsOnBuilding - no building under unit');
        return defaultResult;
    }

    if (['well', 'temple'].includes(building.attr.type)) {
        return {
            ...defaultResult,
            isOnHealsBuilding: true,
        };
    }

    if (building.getUserId() === activeUserId) {
        return {
            ...defaultResult,
            isOnSelfBuilding: true,
        };
    }

    const buildingTeamId = getTeamIdByUserId(building.attr.userId || '', gameData);

    if (buildingTeamId === activeUserId) {
        return {
            ...defaultResult,
            isOnTeamBuilding: true,
        };
    }

    return {
        ...defaultResult,
        isOnEnemyBuilding: true,
    };
}

// eslint-disable-next-line complexity, max-statements, id-length
function getMadePathToNearOccupyAbleBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType
): {|
    +madePathToNearOccupyAbleBuilding: number,
    +isReachedNearOccupyAbleBuilding: boolean,
    // +isLastBuilding: boolean,
    +isAllBuildingsOccupied: boolean,
    // +canLeaveToOccupyBuilding: boolean,
|} {
    // get all building
    // get all farm, destroyed farm and castle with no my team id
    const defaultResult = {
        madePathToNearOccupyAbleBuilding: 0,
        isReachedNearOccupyAbleBuilding: false,
        // isLastBuilding: false,
        isAllBuildingsOccupied: false,
        // canLeaveToOccupyBuilding: false,
    };

    const endPoint = getEndPoint(botResultActionData);
    const {unit} = botResultActionData;
    const activeUserId = unit.getUserId();
    const unitAttr = unit.getAttr();

    if (activeUserId === null) {
        console.error('getMadePathToNearOccupyAbleBuilding - unit has not user id', unit);
        return defaultResult;
    }

    const unitTeamId = getTeamIdByUserId(activeUserId, gameData);

    if (unitTeamId === null) {
        console.error('getMadePathToNearOccupyAbleBuilding - can not find user by id', activeUserId);
        return defaultResult;
    }

    const buildingList = gameData.buildingList
        .filter(
            (buildingInList: Building): boolean => {
                const buildingTeamId = getTeamIdByUserId(buildingInList.attr.userId || '', gameData);

                if (buildingTeamId === unitTeamId) {
                    return false;
                }

                return ['farm-destroyed', 'castle', 'farm'].includes(buildingInList.attr.type);
            }
        )
        // sort from near to far
        .sort(
            (buildingForOccupyA: Building, buildingForOccupyB: Building): number => {
                const pathToA =
                    ((buildingForOccupyA.attr.x - endPoint.x) ** 2 + (buildingForOccupyA.attr.y - endPoint.y) ** 2) **
                    0.5;
                const pathToB =
                    ((buildingForOccupyB.attr.x - endPoint.x) ** 2 + (buildingForOccupyB.attr.y - endPoint.y) ** 2) **
                    0.5;

                return pathToA - pathToB;
            }
        );

    if (buildingList.length === 0) {
        return {
            ...defaultResult,
            isAllBuildingsOccupied: true,
        };
    }

    // const currentUnitGuideData = unitGuideData[unit.attr.type];
    // const isLastBuilding = buildingList.length === 1 && currentUnitGuideData.isCommander !== true;
    const nearestBuilding = buildingList[0];

    const isReachedNearOccupyAbleBuilding = buildingList.some(
        (buildingInList: Building): boolean => {
            return buildingInList.attr.x === endPoint.x && buildingInList.attr.y === endPoint.y;
        }
    );

    if (isReachedNearOccupyAbleBuilding) {
        return {
            madePathToNearOccupyAbleBuilding: ((unitAttr.x - endPoint.x) ** 2 + (unitAttr.y - endPoint.y) ** 2) ** 0.5,
            isReachedNearOccupyAbleBuilding: true,
            // isLastBuilding,
            isAllBuildingsOccupied: false,
            // canLeaveToOccupyBuilding: false,
        };
    }

    const pathSizeBefore =
        ((unitAttr.x - nearestBuilding.attr.x) ** 2 + (unitAttr.y - nearestBuilding.attr.y) ** 2) ** 0.5;

    if (pathSizeBefore === 0) {
        return {
            madePathToNearOccupyAbleBuilding: 100,
            isReachedNearOccupyAbleBuilding: true,
            // isLastBuilding,
            isAllBuildingsOccupied: false,
            // canLeaveToOccupyBuilding: false,
        };
    }

    const pathSizeAfter =
        ((endPoint.x - nearestBuilding.attr.x) ** 2 + (endPoint.y - nearestBuilding.attr.y) ** 2) ** 0.5;
    const madePathToNearOccupyAbleBuilding = (pathSizeBefore - pathSizeAfter / pathSizeBefore) * 100;

    return {
        madePathToNearOccupyAbleBuilding,
        isReachedNearOccupyAbleBuilding: false,
        // isLastBuilding,
        isAllBuildingsOccupied: false,
        // canLeaveToOccupyBuilding: false,
    };
}

// eslint-disable-next-line complexity, max-statements, id-length
function getMadePathToNearHealsBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType
): {|
    +madePathToNearHealsBuilding: number,
    +isReachedToNearHealsBuilding: boolean,
|} {
    // get all building
    // get all farm, destroyed farm and castle with no my team id
    const defaultResult = {
        madePathToNearHealsBuilding: 0,
        isReachedToNearHealsBuilding: false,
    };

    const endPoint = getEndPoint(botResultActionData);
    const {unit} = botResultActionData;
    const activeUserId = unit.getUserId();
    const unitAttr = unit.getAttr();

    if (activeUserId === null) {
        console.error('unit has not user id', unit);
        return defaultResult;
    }

    const unitTeamId = getTeamIdByUserId(activeUserId, gameData);

    if (unitTeamId === null) {
        console.error('getMadePathToNearHealsBuilding - can not find user by id', activeUserId);
        return defaultResult;
    }

    if (unit.getHitPoints() > 65) {
        return {
            madePathToNearHealsBuilding: 0,
            isReachedToNearHealsBuilding: false,
        };
    }

    const buildingList = gameData.buildingList
        .filter(
            (buildingInList: Building): boolean => {
                const buildingType = buildingInList.attr.type;

                if (['well', 'temple'].includes(buildingType)) {
                    return true;
                }

                return ['castle', 'farm'].includes(buildingType) && buildingInList.attr.userId === activeUserId;
            }
        )
        // sort from near to far
        .sort(
            (buildingHealsA: Building, buildingHealsB: Building): number => {
                const pathToA =
                    ((buildingHealsA.attr.x - endPoint.x) ** 2 + (buildingHealsA.attr.y - endPoint.y) ** 2) ** 0.5;
                const pathToB =
                    ((buildingHealsB.attr.x - endPoint.x) ** 2 + (buildingHealsB.attr.y - endPoint.y) ** 2) ** 0.5;

                return pathToA - pathToB;
            }
        );

    if (buildingList.length === 0) {
        return defaultResult;
    }

    const isReachedToNearHealsBuilding = buildingList.some(
        (buildingInList: Building): boolean => {
            return buildingInList.attr.x === endPoint.x && buildingInList.attr.y === endPoint.y;
        }
    );

    if (isReachedToNearHealsBuilding) {
        return {
            madePathToNearHealsBuilding: ((unitAttr.x - endPoint.x) ** 2 + (unitAttr.y - endPoint.y) ** 2) ** 0.5,
            isReachedToNearHealsBuilding,
        };
    }

    const nearestBuilding = buildingList[0];
    const pathSizeBefore =
        ((unitAttr.x - nearestBuilding.attr.x) ** 2 + (unitAttr.y - nearestBuilding.attr.y) ** 2) ** 0.5;
    const pathSizeAfter =
        ((endPoint.x - nearestBuilding.attr.x) ** 2 + (endPoint.y - nearestBuilding.attr.y) ** 2) ** 0.5;
    const madePathToNearHealsBuilding = (pathSizeBefore - pathSizeAfter / pathSizeBefore) * 100;

    return {
        madePathToNearHealsBuilding,
        isReachedToNearHealsBuilding: false,
    };
}

function getCanRaiseSkeleton(botResultActionData: BotResultActionDataType): boolean {
    const {unitAction} = botResultActionData;

    return Boolean(unitAction && unitAction.type === 'raise-skeleton');
}

function getCanFixFarm(botResultActionData: BotResultActionDataType): boolean {
    const {unitAction} = botResultActionData;

    return Boolean(unitAction && unitAction.type === 'fix-building');
}

function getEndPoint(botResultActionData: BotResultActionDataType): PointType {
    const {unit, moveAction} = botResultActionData;
    const {action} = moveAction;

    if (action) {
        return {
            x: action.to.x,
            y: action.to.y,
        };
    }

    const unitAttr = unit.getAttr();

    return {
        x: unitAttr.x,
        y: unitAttr.y,
    };
}

function getPlaceArmor(botResultActionData: BotResultActionDataType): number {
    const {unit, armorMap} = botResultActionData;
    const unitAttr = unit.getAttr();
    const currentUnitGuideData = unitGuideData[unitAttr.type];
    const {moveType} = currentUnitGuideData;
    const unitArmorMap =
        moveType === 'walk' || moveType === 'fly' || moveType === 'flow' ? armorMap[moveType] : armorMap.walk;
    const {x, y} = getEndPoint(botResultActionData);

    return unitArmorMap[y][x];
}

function getAvailableGivenDamage(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>
): number {
    const {x, y} = getEndPoint(botResultActionData);
    let damage = 0;

    // one unit can attack only one time
    enemyUnitAllActionsMapList.forEach((enemyUnitAllAvailableActionsMap: EnemyUnitAllAvailableActionsMapType) => {
        const {damageMap} = enemyUnitAllAvailableActionsMap;
        const mapDamage = damageMap[y][x];

        if (typeof mapDamage === 'number' && mapDamage > 0) {
            damage += mapDamage;
        }
    });

    return damage;
}

function getRateBotResultAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): RawRateType {
    let rawRate: RawRateType = JSON.parse(JSON.stringify(defaultRawRate));
    const {unitAction, unit} = botResultActionData;
    const currentHitPoints = unit.getHitPoints();
    const {x, y} = getEndPoint(botResultActionData);

    rawRate = {
        hitPoints: currentHitPoints,
        ...rawRate,
        // rawRate.attack.hitPoints
        attack: {
            ...rawRate.attack,
            hitPoints: currentHitPoints,
        },
        // rawRate.unit.endPosition.x, rawRate.unit.endPosition.y, rawRate.unit.hitPoints
        unit: {
            ...rawRate.unit,
            endPosition: {
                ...rawRate.unit.endPosition,
                x,
                y,
            },
            // hitPoints: currentHitPoints,
        },
        // rawRate.placeArmor
        placeArmor: getPlaceArmor(botResultActionData),
        // rawRate.availableGivenDamage
        availableGivenDamage: getAvailableGivenDamage(botResultActionData, enemyUnitAllActionsMapList),
        // rawRate.madePathToNearOccupyAbleBuilding
        // rawRate.isReachedNearOccupyAbleBuilding
        ...getMadePathToNearOccupyAbleBuilding(botResultActionData, gameData),
        // rawRate.madePathToNearHealsBuilding
        // rawRate.isReachedToNearHealsBuilding
        ...getMadePathToNearHealsBuilding(botResultActionData, gameData),
        // rawRate.isOnHealsBuilding: false,
        // rawRate.isOnSelfBuilding: false,
        // rawRate.isOnTeamBuilding: false,
        // rawRate.isOnEnemyBuilding: false,
        ...getIsOnBuilding(botResultActionData, gameData),
        // rawRate.canRaiseSkeleton
        canRaiseSkeleton: getCanRaiseSkeleton(botResultActionData),
        // rawRate.canFixFarm
        canFixFarm: getCanFixFarm(botResultActionData),
        // rawRate.canLeaveToOccupyBuilding
        canLeaveToOccupyBuilding: getCanLeaveToOccupyBuilding(botResultActionData, gameData),
        // rawRate.canOccupyEnemyFarm
        canOccupyEnemyFarm: getCanOccupyEnemyBuilding(botResultActionData, gameData, 'farm'),
        // rawRate.canOccupyEnemyFarm
        canOccupyEnemyCastle: getCanOccupyEnemyBuilding(botResultActionData, gameData, 'castle'),
        // rawRate.canOccupyNoManFarm
        canOccupyNoManFarm: getCanOccupyNaManBuilding(botResultActionData, gameData, 'farm'),
        // rawRate.canOccupyNoManFarm
        canOccupyNoManCastle: getCanOccupyNaManBuilding(botResultActionData, gameData, 'castle'),
        // rawRate.canDestroyEnemyFarm
        canDestroyEnemyFarm: getCanDestroyEnemyBuilding(botResultActionData, gameData, 'farm'),
        // rawRate.canLeaveFromUnitUnderUnit
        canLeaveFromUnitUnderUnit: getCanLeaveFromUnitUnderUnit(botResultActionData, gameData),
    };

    // rawRate.attack
    if (unitAction && unitAction.type === 'attack') {
        rawRate = {
            ...rawRate,
            attack: {
                ...rawRate.attack,
                damageGiven: unitAction.aggressor.damage.given,
                damageReceived: unitAction.aggressor.damage.received,
                hitPoints: unitAction.aggressor.hitPoints,
            },
        };
    }

    return rawRate;
}

const rateConfig: {[fieldName: $Keys<RawRateType>]: number} = {
    attack: 10,
    hitPoints: 1,
    placeArmor: 1,
    // availableGivenDamage: -1 / 100500, // TODO: make normal rating, -1 / 5
    availableGivenDamage: 0, // TODO: make normal rating, -1 / 5
    madePathToNearOccupyAbleBuilding: 2,
    isReachedNearOccupyAbleBuilding: 1000,
    madePathToNearHealsBuilding: 2,
    isReachedToNearHealsBuilding: 500,
    canRaiseSkeleton: 1000,
    canFixFarm: 750,
    canLeaveToOccupyBuilding: 3000,
    canOccupyEnemyFarm: 2000,
    canOccupyEnemyCastle: 3000,
    canOccupyNoManFarm: 1500,
    canOccupyNoManCastle: 2500,
    canDestroyEnemyFarm: 100,
    canLeaveFromUnitUnderUnit: 100e3, // need really big rate to assure move unit from other unit
    isOnHealsBuilding: 100,
    isOnTeamBuilding: 200,
    isOnEnemyBuilding: 300,
    isOnSelfBuilding: 400,
    canPreventEnemyFixFarm: 0,
    canPreventEnemyOccupyNoManFarm: 0,
    canPreventEnemyOccupyMyFarm: 0,
    canPreventEnemyOccupyMyTeamFarm: 0,
    canPreventEnemyOccupyNoManCastle: 0,
    canPreventEnemyOccupyMyCastle: 0,
    canPreventEnemyOccupyMyTeamCastle: 0,
};

// eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
export function rateBotResultActionData(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): number {
    const actionRawRate = getRateBotResultAction(botResultActionData, enemyUnitAllActionsMapList, gameData);

    // unit with more hit points has more priority
    let rate = actionRawRate.hitPoints * rateConfig.hitPoints;

    const hasAttack = actionRawRate.attack.damageGiven !== 0 || actionRawRate.attack.damageReceived !== 0;

    let buildingBonusRate = 0;

    ['isOnHealsBuilding', 'isOnTeamBuilding', 'isOnEnemyBuilding', 'isOnSelfBuilding'].forEach(
        (fieldName: $Keys<RawRateType>) => {
            buildingBonusRate += actionRawRate[fieldName] ? rateConfig[fieldName] : 0;
        }
    );

    if (hasAttack) {
        rate += (actionRawRate.attack.damageGiven - actionRawRate.attack.damageReceived) * rateConfig.attack;
        rate += buildingBonusRate;
    }

    rate += actionRawRate.placeArmor * rateConfig.placeArmor;

    rate += actionRawRate.availableGivenDamage * rateConfig.availableGivenDamage;

    rate += actionRawRate.madePathToNearOccupyAbleBuilding * rateConfig.madePathToNearOccupyAbleBuilding;
    rate += actionRawRate.isReachedNearOccupyAbleBuilding ? rateConfig.isReachedNearOccupyAbleBuilding : 0;

    rate += actionRawRate.madePathToNearHealsBuilding * rateConfig.madePathToNearHealsBuilding;
    rate += actionRawRate.isReachedToNearHealsBuilding ? rateConfig.isReachedToNearHealsBuilding : 0;

    rate += actionRawRate.canRaiseSkeleton ? rateConfig.canRaiseSkeleton : 0;

    if (!hasAttack) {
        rate += actionRawRate.canFixFarm ? rateConfig.canFixFarm : 0;
        rate += actionRawRate.canDestroyEnemyFarm ? rateConfig.canDestroyEnemyFarm : 0;
    }

    [
        'canOccupyEnemyFarm',
        'canOccupyEnemyCastle',
        'canOccupyNoManFarm',
        'canOccupyNoManCastle',
        'canLeaveToOccupyBuilding',
        'canLeaveFromUnitUnderUnit',
    ].forEach((fieldName: $Keys<RawRateType>) => {
        rate += actionRawRate[fieldName] ? rateConfig[fieldName] + buildingBonusRate : 0;
    });

    console.log(actionRawRate, rate);

    return rate;
}
