// @flow

import type {BotResultActionDataType, EnemyUnitAllAvailableActionsMapType} from './bot';
import {defaultUnitData, unitGuideData} from './unit/unit-guide';
import {Building} from './building/building';
import type {GameDataType} from './unit/unit';
import type {MapUserType} from '../../../maps/type';
import type {TeamIdType} from '../../../maps/map-guide';

type PointType = {|
    +x: number,
    +y: number,
|};

export type RawRateType = {|
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
        hitPoints: number, // done // unit with bigger hp has priority, to attack and move on front
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
    +madePathToNearOccupyAbleBuilding: number, // done - NOT TESTED // if reached -> madePathSize, else -> percent of needed path
    +isReachedNearOccupyAbleBuilding: boolean, // done - NOT TESTED
    +madePathToNearHealsBuilding: number, // in progress // use if unit has < 50hp
    +isReachedToNearHealsBuilding: boolean, // in progress // use if unit has < 50hp

    +canRaiseSkeleton: boolean, // in progress

    // farm
    +canFixFarm: boolean, // in progress
    +canOccupyEnemyFarm: boolean, // in progress
    +canOccupyNoManFarm: boolean, // in progress
    +canDestroyEnemyFarm: boolean, // in progress
    // +canDestroyNoManFarm: boolean,  // will not be done // catapult can not destroy no man's farm

    // castle
    +canOccupyEnemyCastle: boolean, // in progress
    +canOccupyNoManCastle: boolean, // in progress

    +canPreventEnemyFixFarm: boolean, // in progress

    +canPreventEnemyOccupyNoManFarm: boolean, // in progress
    +canPreventEnemyOccupyMyFarm: boolean, // in progress
    +canPreventEnemyOccupyMyTeamFarm: boolean, // in progress

    +canPreventEnemyOccupyNoManCastle: boolean, // in progress
    +canPreventEnemyOccupyMyCastle: boolean, // in progress
    +canPreventEnemyOccupyMyTeamCastle: boolean, // in progress
|};

const defaultRawRate: RawRateType = {
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
        hitPoints: defaultUnitData.hitPoints,
    },
    placeArmor: 0,
    availableGivenDamage: 0,
    madePathToNearOccupyAbleBuilding: 0,
    isReachedNearOccupyAbleBuilding: false,
    madePathToNearHealsBuilding: 0,
    isReachedToNearHealsBuilding: false,
    canRaiseSkeleton: false,
    canFixFarm: false,
    canOccupyEnemyFarm: false,
    canOccupyNoManFarm: false,
    canDestroyEnemyFarm: false,
    canOccupyEnemyCastle: false,
    canOccupyNoManCastle: false,
    canPreventEnemyFixFarm: false,
    canPreventEnemyOccupyNoManFarm: false,
    canPreventEnemyOccupyMyFarm: false,
    canPreventEnemyOccupyMyTeamFarm: false,
    canPreventEnemyOccupyNoManCastle: false,
    canPreventEnemyOccupyMyCastle: false,
    canPreventEnemyOccupyMyTeamCastle: false,
};

function getTeamIdByUserId(userId: string, gameData: GameDataType): TeamIdType | null {
    const playerData = gameData.userList.find((userData: MapUserType): boolean => userData.userId === userId) || null;

    if (playerData === null) {
        console.error('getTeamIdByUserId - can not find user by id', userId);
        return null;
    }

    return playerData.teamId;
}

// eslint-disable-next-line id-length, max-statements
function getMadePathToNearOccupyAbleBuilding(
    botResultActionData: BotResultActionDataType,
    gameData: GameDataType
): {|
    +madePathToNearOccupyAbleBuilding: number,
    +isReachedNearOccupyAbleBuilding: boolean,
|} {
    // get all building
    // get all farm, destroyed farm and castle with no my team id
    const defaultResult = {
        madePathToNearOccupyAbleBuilding: 0,
        isReachedNearOccupyAbleBuilding: false,
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
        console.error('getMadePathToNearOccupyAbleBuilding - can not find user by id', activeUserId);
        return defaultResult;
    }

    const buildingList = gameData.buildingList
        .filter(
            (buildingInList: Building): boolean => {
                const buildingTeamId = getTeamIdByUserId(buildingInList.attr.userId || '', gameData);

                return (
                    buildingTeamId !== unitTeamId &&
                    ['farm-destroyed', 'castle', 'farm'].includes(buildingInList.attr.type)
                );
            }
        )
        // sort from near to far
        .sort(
            (buildingA: Building, buildingB: Building): number => {
                const pathToA = ((buildingA.attr.x - endPoint.x) ** 2 + (buildingA.attr.y - endPoint.y) ** 2) ** 0.5;
                const pathToB = ((buildingB.attr.x - endPoint.x) ** 2 + (buildingB.attr.y - endPoint.y) ** 2) ** 0.5;

                return pathToA - pathToB;
            }
        );

    if (buildingList.length === 0) {
        return defaultResult;
    }

    const isReachedNearOccupyAbleBuilding = buildingList.some(
        (buildingInList: Building): boolean => {
            return buildingInList.attr.x === endPoint.x && buildingInList.attr.y === endPoint.y;
        }
    );

    if (isReachedNearOccupyAbleBuilding) {
        return {
            madePathToNearOccupyAbleBuilding: ((unitAttr.x - endPoint.x) ** 2 + (unitAttr.y - endPoint.y) ** 2) ** 0.5,
            isReachedNearOccupyAbleBuilding,
        };
    }

    const nearestBuilding = buildingList[0];
    const pathSizeBefore =
        ((unitAttr.x - nearestBuilding.attr.x) ** 2 + (unitAttr.y - nearestBuilding.attr.y) ** 2) ** 0.5;
    const pathSizeAfter =
        ((endPoint.x - nearestBuilding.attr.x) ** 2 + (endPoint.y - nearestBuilding.attr.y) ** 2) ** 0.5;
    const madePathToNearOccupyAbleBuilding = (pathSizeBefore - pathSizeAfter / pathSizeBefore) * 100;

    return {
        madePathToNearOccupyAbleBuilding,
        isReachedNearOccupyAbleBuilding: false,
    };
}

// eslint-disable-next-line id-length, max-statements
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

    const buildingList = gameData.buildingList
        .filter(
            (buildingInList: Building): boolean => {
                const buildingTeamId = getTeamIdByUserId(buildingInList.attr.userId || '', gameData);

                return (
                    buildingTeamId !== unitTeamId &&
                    ['farm-destroyed', 'castle', 'farm'].includes(buildingInList.attr.type)
                );
            }
        )
        // sort from near to far
        .sort(
            (buildingA: Building, buildingB: Building): number => {
                const pathToA = ((buildingA.attr.x - endPoint.x) ** 2 + (buildingA.attr.y - endPoint.y) ** 2) ** 0.5;
                const pathToB = ((buildingB.attr.x - endPoint.x) ** 2 + (buildingB.attr.y - endPoint.y) ** 2) ** 0.5;

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

    // rawRate.unit.endPosition.x, rawRate.unit.endPosition.y, rawRate.unit.hitPoints
    rawRate = {
        ...rawRate,
        unit: {
            ...rawRate.unit,
            endPosition: {
                ...rawRate.unit.endPosition,
                x,
                y,
            },
            hitPoints: currentHitPoints,
        },
    };

    // rawRate.attack.hitPoints
    rawRate = {
        ...rawRate,
        attack: {
            ...rawRate.attack,
            hitPoints: currentHitPoints,
        },
    };

    // rawRate.attack
    if (unitAction && unitAction.type === 'attack') {
        rawRate = {
            ...rawRate,
            attack: {
                damageGiven: unitAction.aggressor.damage.given,
                damageReceived: unitAction.aggressor.damage.received,
                hitPoints: unitAction.aggressor.hitPoints,
            },
        };
    }

    // rawRate.placeArmor
    rawRate = {
        ...rawRate,
        placeArmor: getPlaceArmor(botResultActionData),
    };

    // rawRate.availableGivenDamage
    rawRate = {
        ...rawRate,
        availableGivenDamage: getAvailableGivenDamage(botResultActionData, enemyUnitAllActionsMapList),
    };

    // rawRate.madePathToNearOccupyAbleBuilding
    // rawRate.isReachedNearOccupyAbleBuilding
    // rawRate.madePathToNearHealsBuilding
    // rawRate.isReachedToNearHealsBuilding
    rawRate = {
        ...rawRate,
        ...getMadePathToNearOccupyAbleBuilding(botResultActionData, gameData),
        ...getMadePathToNearHealsBuilding(botResultActionData, gameData),
    };

    return rawRate;
}

function rateMoveAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): number {
    console.log(getRateBotResultAction(botResultActionData, enemyUnitAllActionsMapList, gameData));

    return Math.random();
}

function rateMainAction(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): number {
    console.log(getRateBotResultAction(botResultActionData, enemyUnitAllActionsMapList, gameData));

    return Math.random();
}

export function rateBotResultActionData(
    botResultActionData: BotResultActionDataType,
    enemyUnitAllActionsMapList: Array<EnemyUnitAllAvailableActionsMapType>,
    gameData: GameDataType
): number {
    const {unitAction} = botResultActionData;

    return unitAction === null ?
        rateMoveAction(botResultActionData, enemyUnitAllActionsMapList, gameData) :
        rateMainAction(botResultActionData, enemyUnitAllActionsMapList, gameData);
}
