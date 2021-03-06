// @flow

/* global window, requestAnimationFrame, location */

/* eslint consistent-this: ["error", "game"] */

import type {BuildingType, GraveType, LandscapeType, MapType, MapUserType, UnitType} from '../../../maps/type';
import {unitActionStateDefaultValue} from '../../../maps/type';
import type {AllRoomSettingsType, ServerUserType} from '../../../module/server-api';
import * as serverApi from '../../../module/server-api';
import {mapGuide} from '../../../maps/map-guide';
import type {WrongStateType, WrongStateTypeUnitOnUnitType} from './helper';
import {
    bindClick,
    canOpenStore,
    countHealHitPointOnBuilding,
    getMatchResult,
    getReducedLandscapeType,
    getWrongStateList,
    isOnLineRoomType,
    isStoreOpen,
    isUserDefeat,
    mergeActionList,
    procedureMakeGraveForMapUnit,
} from './helper';
import {Render} from './render';
import {Building} from './building/building';
import {Grave} from './grave/grave';
import type {
    GameDataType,
    UnitActionAttackType,
    UnitActionDestroyBuildingType,
    UnitActionFixBuildingType,
    UnitActionMoveType,
    UnitActionOccupyBuildingType,
    UnitActionOpenStoreType,
    UnitActionRaiseSkeletonType,
    UnitActionsMapType,
    UnitActionType,
} from './unit/unit';
import {Unit} from './unit/unit';
import {user} from '../../../module/user';
import find from 'lodash/find';
import findLast from 'lodash/findLast';
import isEqual from 'lodash/isEqual';
import type {SocketMessagePushStateType, SocketMessageTakeTurnType, SocketMessageType} from '../../../module/socket';
import {socket} from '../../../module/socket';
import MainModel from 'main-model';
import * as unitMaster from './unit/master';
import {defaultUnitData} from './unit/unit-guide';
import {bottomBarData, disableReasonKeyMap, GameView} from '../c-game';
import {storeViewId} from '../../store/c-store';
import {Queue} from '../../../lib/queue/queue';
import {localSocketIoClient} from '../../../module/socket-local';
import {isNotFunction, isNotNumber, isNotString, isNumber, isString} from '../../../lib/is/is';
import {messageConst} from '../../../lib/local-server/room/message-const';
import type {BotResultActionDataType} from './bot';
import {botBuyUnit, canPlayerBuyUnit, getBotTurnDataList} from './bot';
import {waitFor} from '../../../lib/wait-for';
import {wait} from '../../../lib/sleep';
import {onPushStateDone, subscribeOnPushStateDone} from '../../../lib/on-message-done';
import {forceWindowUpdate} from '../../ui/fade/helper';

type RenderSettingType = {|
    width: number,
    height: number,
    view: HTMLElement,
    map: MapType,
|};

// const sprite = require('./image.png');

export class GameModel {
    // app: PIXI.Application;
    // layer: {|
    //     landscape: PIXI.Container,
    //     buildings: PIXI.Container,
    //     units: PIXI.Container,
    // |};
    onMessageQueue: Queue;
    render: Render;
    gameView: GameView;
    settings: AllRoomSettingsType;
    userList: Array<ServerUserType>;
    buildingList: Array<Building>;
    unitList: Array<Unit>;
    graveList: Array<Grave>;
    mapState: MapType;
    emptyActionMap: Array<Array<[]>>;
    emptyValueMap: Array<Array<number | string | boolean | null | void>>;
    roomId: string;
    model: MainModel;
    pathMap: {|
        walk: Array<Array<number>>,
        flow: Array<Array<number>>,
        fly: Array<Array<number>>,
    |};

    armorMap: {|
        walk: Array<Array<number>>,
        flow: Array<Array<number>>,
        fly: Array<Array<number>>,
    |};

    message: {|
        list: Array<SocketMessageType>,
    |};

    constructor() {
        const game = this;

        game.initializeProperties();
    }

    // '@private' is not works, but it needed to code understanding
    // @private
    initializeProperties() {
        const game = this;

        game.onMessageQueue = new Queue();
        game.render = new Render();
        game.buildingList = [];
        game.unitList = [];
        game.graveList = [];
        game.pathMap = {
            walk: [],
            flow: [],
            fly: [],
        };
        game.armorMap = {
            walk: [],
            flow: [],
            fly: [],
        };
        game.model = new MainModel();
        game.message = {
            list: [],
        };
    }

    initialize(renderSetting: RenderSettingType) {
        const game = this;
        const {map} = game.settings;

        map.units = map.units.filter((mapUnitData: UnitType): boolean => isString(mapUnitData.userId));

        game.setMapState(map);

        game.render.initialize(renderSetting);

        // draw landscape
        game.render.drawLandscape(map, async (x: number, y: number) => {
            game.gameView.setActiveLandscape(x, y);

            if (!game.isMyTurn()) {
                console.log('click on landscape: not your turn');
                return;
            }

            await game.render.cleanActionsList();

            const wrongStateList = getWrongStateList(game.getGameData());

            if (wrongStateList !== null) {
                await game.showWrongState(wrongStateList[0]);
                return;
            }
        });

        // add buildings
        map.buildings
            .sort(
                (buildingA: BuildingType, buildingB: BuildingType): number =>
                    buildingA.type === mapGuide.building.castle.name ? Infinity : -Infinity
            )
            .forEach((buildingData: BuildingType) => {
                game.createBuilding(buildingData);
            });

        // add units
        map.units.forEach((unitData: UnitType) => {
            if (isNotString(unitData.userId)) {
                console.error('unit has no userId');
                return;
            }
            game.createUnit(unitData);
        });

        // add graves
        map.graves.forEach((graveData: GraveType) => {
            game.createGrave(graveData);
        });

        // make path maps
        game.initializePathMaps();

        game.bindEventListeners();

        game.refreshWispAura();

        forceWindowUpdate();
    }

    bindEventListeners() {
        const game = this;
        const {model} = game;

        if (isOnLineRoomType()) {
            model.listenTo(socket.attr.model, 'message', (message: SocketMessageType | void) => {
                if (!message) {
                    console.error('SocketMessage is not define');
                    return;
                }
                game.onMessageWrapper(message);
            });
        } else {
            localSocketIoClient.on('message', (message: SocketMessageType) => {
                game.onMessageWrapper(message);
            });
        }
    }

    isMyTurn(): boolean {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            return false;
        }

        return mapState.activeUserId === user.getId();
    }

    getLastSocketMessage(): SocketMessageType | null {
        const game = this;
        const messageList = game.message.list;
        const messageListLength = messageList.length;

        if (messageListLength === 0) {
            return null;
        }

        return messageList[messageListLength - 1];
    }

    getEarnedMoney(userId: string): number | null {
        const game = this;

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for getEarnedMoney');
            return null;
        }

        let earnedMoney = 0;

        // count money
        newMap.buildings.forEach((mapBuilding: BuildingType) => {
            if (mapBuilding.userId !== userId) {
                return;
            }

            const buildingData = mapGuide.building[mapBuilding.type];

            earnedMoney += buildingData.moneyBonus;
        });

        return earnedMoney;
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async refreshUnitActionState(userId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for refreshUnitActionState');
            return;
        }

        const {unitList} = game;
        const mapUnitList = newMap.units;
        const isUnitListLengthEqual = mapUnitList.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('Unit List Length is not equal', mapUnitList, unitList);
            return;
        }

        newMap.activeUserId = userId;

        // refresh action state
        mapUnitList.forEach((mapUnit: UnitType) => {
            const unitActionState = mapUnit.hasOwnProperty('action') && mapUnit.action ? mapUnit.action : null;

            if (unitActionState === null) {
                // console.log('unit has no property \'action\'', mapUnit);
                return;
            }

            Object.keys(unitActionState).forEach((key: string) => {
                unitActionState[key] = unitActionStateDefaultValue[key];
            });
        });

        // refresh poison countdown
        mapUnitList.forEach((mapUnit: UnitType) => {
            if (isNotNumber(mapUnit.poisonCountdown)) {
                return;
            }
            if (mapUnit.poisonCountdown === 0) {
                return;
            }

            // eslint-disable-next-line no-param-reassign
            mapUnit.poisonCountdown -= 1;
        });

        // add hit point for units under building
        mapUnitList.forEach((mapUnit: UnitType) => {
            if (mapUnit.userId !== userId) {
                return;
            }

            const additionHitPointValue = countHealHitPointOnBuilding(newMap, mapUnit);

            if (additionHitPointValue === null) {
                return;
            }

            if (mapUnit.hitPoints + additionHitPointValue > defaultUnitData.hitPoints) {
                console.error('too many hit points');
                return;
            }

            // eslint-disable-next-line no-param-reassign
            mapUnit.hitPoints += additionHitPointValue;
        });

        // update graves
        const {graveList} = game;
        const mapGraveList = newMap.graves;
        const isGraveListLengthEqual = mapGraveList.length === graveList.length;

        if (isGraveListLengthEqual === false) {
            console.error('Grave List Length is not equal', mapUnitList, unitList);
            return;
        }

        mapGraveList.forEach((mapGrave: GraveType) => {
            // eslint-disable-next-line no-param-reassign
            mapGrave.removeCountdown -= 1;
        });

        newMap.graves = mapGraveList.filter(
            (mapGrave: GraveType): boolean => {
                return mapGrave.removeCountdown > 0;
            }
        );

        // const userId = user.getId();
        const mapUser = find(newMap.userList, {userId}) || null;

        if (mapUser === null) {
            console.error('can not find mapUser', newMap, userId);
            return;
        }

        // add money
        const earnedMoney = game.getEarnedMoney(userId);

        if (earnedMoney === null) {
            console.error('earnedMoney for userId is null');
            return;
        }

        mapUser.money += earnedMoney;

        // eslint-disable-next-line sonarjs/no-duplicate-string
        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, userId, {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                type: messageConst.type.pushState,
                state: {
                    type: 'refresh-unit-list',
                    map: newMap,
                    activeUserId: userId,
                },
            })
            .then((response: mixed): void => console.log('---> refresh unit list pushed', response))
            .catch((error: Error) => {
                console.error('error with refresh unit list pushed');
                console.error(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                console.error('error with removeDisableReason client-push-state');
                console.error(error);
            });
    }

    // eslint-disable-next-line complexity
    async onMessage(message: SocketMessageType) {
        const game = this;

        if (message.type === messageConst.type.pushState && message.states.last.state) {
            game.setMapState(message.states.last.state.map);
        }

        switch (message.type) {
            case messageConst.type.takeTurn:
                await game.handleServerTakeTurn(message);
                game.gameView.popupChangeActiveUser({
                    // isOpen: true,
                    activeUserId: message.states.last.activeUserId,
                });

                break;

            case messageConst.type.dropTurn:
                await game.render.cleanActionsList();
                break;

            case messageConst.type.joinIntoRoom:
                break;

            case messageConst.type.leaveFromRoom:
                // work only if your turn
                await game.syncMapWithServerUserList(message);

                // TODO: check here map users and server users, only if your turn
                console.warn('onMessage - check here map users and server users, only if your turn');
                break;

            case messageConst.type.userDisconnected:
                break;

            case messageConst.type.pushState:
                await game.handleServerPushState(message);
                game.checkMapState(message.states.last.state.map);
                // game.setMapState(message.states.last.state.map);
                game.refreshWispAura();
                // game.gameView.forceUpdate();

                await game.syncMapWithServerUserList(message);

                await onPushStateDone(message);

                break;

            default:
                console.error('---> view - game - unsupported message type:', message);
        }
    }

    // eslint-disable-next-line complexity
    onMessageWrapper(message: SocketMessageType) {
        const game = this;
        const lastSavedSocketMessage = game.getLastSocketMessage();
        const messageMap =
            message.type === messageConst.type.pushState && message.states.last.state && message.states.last.state.map ?
                message.states.last.state.map :
                null;

        // check for messed message
        if (lastSavedSocketMessage !== null && message.states.length - 1 !== lastSavedSocketMessage.states.length) {
            console.error(
                'you have missed message(s)',
                message.states.length - 1 - lastSavedSocketMessage.states.length,
                message,
                lastSavedSocketMessage
            );

            if (messageMap !== null) {
                game.onMessageQueue.push(async () => {
                    await game.loadMapState(messageMap);
                    game.message.list.push(message);
                });
            } else {
                console.error('message has no map to loadMapState, wait for map', message);
            }
            return;
        }

        game.message.list.push(message);

        game.onMessageQueue.push(async () => {
            game.gameView.addDisableReason('server-receive-message');

            await game.onMessage(message);

            game.gameView.removeDisableReason('server-receive-message');

            await game.detectAndHandleEndGame();
        });
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async handleServerTakeTurn(message: SocketMessageTakeTurnType): Promise<void> {
        const game = this;

        return isOnLineRoomType() ?
            game.handleServerTakeTurnOnLine(message) :
            game.handleServerTakeTurnOffLine(message);
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async handleServerTakeTurnOnLine(message: SocketMessageTakeTurnType) {
        const game = this;

        await game.render.cleanActionsList();

        game.unitList.forEach((unitInList: Unit) => {
            unitInList.setIsActionAvailable(true);
        });

        const getAllRoomUsersResult = await serverApi.getAllRoomUsers(game.roomId);

        const {activeUserId} = message.states.last;

        const isMyTurn = activeUserId === user.getId();

        if (isMyTurn) {
            console.log('---> take turn, and it\'s ME!!!');
            // TODO: check here map users and server users, only if your turn
            console.warn('handleServerTakeTurnOnLine - check here map users and server users, only if your turn');
            await game.refreshUnitActionState(user.getId());
            console.log('---> unit and users - refreshed');
            // await game.refreshUnitPoisonCountdown();
            // await game.refreshGraveCountdown();
            return;
        }

        // try to defect bot
        const activePlayerData = find(getAllRoomUsersResult.users, {userId: activeUserId}) || null;

        if (activePlayerData === null) {
            console.error('It is impossible active player should be in user list');
            return;
        }

        if (activePlayerData.type === 'human') {
            console.log('no any action needed');
            return;
        }

        const firstHuman = find(getAllRoomUsersResult.users, {type: 'human'}) || null;

        if (firstHuman === null) {
            console.error('It is impossible room without human!');
            return;
        }

        if (firstHuman.userId === user.getId()) {
            await game.refreshUnitActionState(activeUserId);

            waitFor(
                (): boolean => {
                    const mapStateWaiting = game.getMapState();

                    if (mapStateWaiting === null) {
                        console.error('handleServerTakeTurnOnLine - mapStateWaiting for bot is undefined');
                        return false;
                    }

                    return mapStateWaiting.activeUserId === activeUserId;
                }
            )
                .then(
                    async (): Promise<void> => {
                        // TODO: remove this, I do not know how to remove this :(
                        console.warn(
                            '---> handleServerTakeTurnOnLine - workaround to make sure game has actual map state'
                        );

                        await wait(3e3);

                        return await game.makeBotTurn();
                    }
                )
                .catch(() => {
                    // TODO: add here drop turn
                    console.error('can not wait for activeUserId');
                    console.error('add here drop turn');
                });
        }

        console.log('---> handleServerTakeTurnOnLine ---- wait for other player ----');
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async handleServerTakeTurnOffLine(message: SocketMessageTakeTurnType) {
        const game = this;

        await game.render.cleanActionsList();

        game.unitList.forEach((unitInList: Unit) => {
            unitInList.setIsActionAvailable(true);
        });

        const getAllRoomUsersResult = await serverApi.getAllRoomUsers(game.roomId);

        const {activeUserId} = message.states.last;

        const userId = user.getId();
        const isMyTurn = activeUserId === userId;

        if (isMyTurn) {
            console.log('---> take turn, and it\'s ME!!!');
            // TODO: check here map users and server users, only if your turn
            console.warn('handleServerTakeTurnOffLine - check here map users and server users, only if your turn');
            await game.refreshUnitActionState(userId);
            console.log('---> unit and users - refreshed');
            // await game.refreshUnitPoisonCountdown();
            // await game.refreshGraveCountdown();
            return;
        }

        // try to defect bot
        const activePlayerData = find(getAllRoomUsersResult.users, {userId: activeUserId}) || null;

        if (activePlayerData === null) {
            console.error('It is impossible active player should be in user list');
            return;
        }

        await game.refreshUnitActionState(activeUserId);

        // you can add human only for offline game
        // but you can play with human in online game
        if (activePlayerData.type === 'human') {
            user.setId(activeUserId);
            return;
        }

        subscribeOnPushStateDone(
            async (socketMessage: SocketMessageType): Promise<boolean> => {
                console.log('---- subscribeOnPushStateDone ----');
                console.log(socketMessage);

                if (
                    socketMessage.type === 'room__push-state' &&
                    // socketMessage.states &&
                    // socketMessage.states.last &&
                    // socketMessage.states.last.state &&
                    socketMessage.states.last.state.activeUserId !== activeUserId
                ) {
                    return true;
                }

                // wait for refreshUnitActionState is applied
                await wait(1e3);

                game.makeBotTurn()
                    .then((): void => console.log('Bot Done turn - Successful'))
                    .catch((): void => console.error('Bot Done turn - Error'));

                return false;
            }
        );

        console.log('---> handleServerTakeTurnOffLine ---- wait for other player ----');
    }

    // eslint-disable-next-line complexity
    async syncMapWithServerUserList(message: SocketMessageType) {
        const game = this;

        const newMap = game.getMapState();
        const currentMap = JSON.parse(JSON.stringify(newMap));

        if (newMap === null) {
            return;
        }

        const messageActiveUserId =
            typeof message.states.last.activeUserId === 'string' ?
                message.states.last.activeUserId :
                newMap.activeUserId;

        const isMyTurn = messageActiveUserId === user.getId();

        if (isMyTurn === false) {
            return;
        }

        const getAllRoomUsersResult = await serverApi.getAllRoomUsers(game.roomId);
        const mapUserList = newMap.userList;

        if (mapUserList.length === getAllRoomUsersResult.users.length) {
            console.log('no changed user');
            return;
        }

        mapUserList.forEach((mapUser: MapUserType) => {
            const serverUser = find(getAllRoomUsersResult.users, {userId: mapUser.userId}) || null;

            // eslint-disable-next-line no-param-reassign
            mapUser.isLeaved = serverUser === null;
        });

        mapUserList.forEach((mapUser: MapUserType) => {
            if (mapUser.isLeaved === false) {
                return;
            }

            const mapUserId = mapUser.userId;

            newMap.units = newMap.units.filter((mapUnit: UnitType): boolean => mapUnit.userId !== mapUserId);
            newMap.buildings = newMap.buildings.map(
                (mapBuilding: BuildingType): BuildingType => {
                    if (mapBuilding.userId === mapUserId) {
                        return {
                            type: mapBuilding.type,
                            x: mapBuilding.x,
                            y: mapBuilding.y,
                            id: mapBuilding.id,
                        };
                    }

                    return mapBuilding;
                }
            );
        });

        if (isEqual(currentMap, newMap)) {
            return;
        }

        // eslint-disable-next-line sonarjs/no-duplicate-string
        game.gameView.addDisableReason('sync-map-with-server-user-list');

        serverApi
            .pushState(game.roomId, user.getId(), {
                type: messageConst.type.pushState,
                state: {
                    type: 'sync-map-with-server-user-list',
                    map: newMap,
                    activeUserId: user.getId(),
                },
            })
            .then((response: mixed): void => console.log('---> user action sync-map-with-server-user-list', response))
            .catch((error: Error) => {
                console.error('client-push-state error');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason('sync-map-with-server-user-list'))
            .catch((error: Error) => {
                console.error('error with removeDisableReason sync-map-with-server-user-list');
                console.log(error);
            });
    }

    // eslint-disable-next-line complexity, max-statements
    async handleServerPushState(message: SocketMessagePushStateType) {
        const game = this;

        if (typeof message.states.last.state.type !== 'string') {
            console.error('message.states.last.state.type should be string', message);
            return;
        }

        switch (message.states.last.state.type) {
            case 'move':
                await game.handleServerPushStateMove(message);

                break;

            case 'attack':
                await game.handleServerPushStateAttack(message);

                break;

            // eslint-disable-next-line sonarjs/no-duplicate-string
            case 'fix-building':
                await game.handleServerPushStateFixBuilding(message);

                break;

            // eslint-disable-next-line sonarjs/no-duplicate-string
            case 'occupy-building':
                await game.handleServerPushStateOccupyBuilding(message);

                break;

            case 'refresh-unit-list':
                await game.handleServerRefreshUnitList(message);

                break;

            // eslint-disable-next-line sonarjs/no-duplicate-string
            case 'raise-skeleton':
                await game.handleServerPushStateRaiseSkeleton(message);

                break;
            // eslint-disable-next-line sonarjs/no-duplicate-string
            case 'destroy-building':
                await game.handleServerPushStateDestroyBuilding(message);

                break;

            case 'buy-unit':
                await game.handleServerPushStateBuyUnit(message);

                break;

            case 'sync-map-with-server-user-list':
                await game.handleServerPushStateSyncMapWithServerUserList(message);

                break;

            default:
                console.error('---> view - game - unsupported push state type:', message);
        }
    }

    async handleServerPushStateMove(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'move') {
            console.error('here is should be a MOVE type', message);
            return Promise.resolve();
        }

        if (!state.unit || isNotString(state.unit.id)) {
            console.error('---> Wrong socket message', message);
            return Promise.resolve();
        }

        const unitState = state.unit;
        const unitId = unitState.id;
        const unitModel = find(game.unitList, {attr: {id: unitId}});

        if (!unitModel) {
            console.error('---> Can not find unitModel', message, game.unitList);
            return Promise.resolve();
        }

        // const isMyUnit = unitModel.getUserId() === user.getId();

        // await game.render.moveWorldTo(state.to.x, state.to.y);

        await unitModel.move(state.to.x, state.to.y, state.path, (x: number, y: number) => {
            // if (isMyUnit) {
            //     return;
            // }
            console.log('game.render.moveWorldTo(x, y);');
            // game.render.moveWorldTo(x, y);
        });

        await game.onUnitClick(unitModel);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async handleServerPushStateAttack(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'attack') {
            console.error('here is should be a ATTACK type', message);
            return Promise.resolve();
        }

        if (!state.aggressor || !state.defender) {
            console.error('no aggressor or defender', state);
            return Promise.resolve();
        }

        const aggressorId = isString(state.aggressor.id) ? state.aggressor.id : null;
        const defenderId = isString(state.defender.id) ? state.defender.id : null;

        if (aggressorId === null || defenderId === null) {
            console.error('aggressor or defender has no Id', state);
            return Promise.resolve();
        }

        const {unitList} = game;
        const aggressorUnit = find(unitList, {attr: {id: aggressorId}}) || null;
        const defenderUnit = find(unitList, {attr: {id: defenderId}}) || null;

        if (aggressorUnit === null || defenderUnit === null) {
            console.error('can not find aggressor or defender', state);
            return Promise.resolve();
        }

        if (state.aggressor.canAttack === false) {
            console.error('aggressor can not attack defender', aggressorUnit, defenderUnit);
            return Promise.resolve();
        }

        await game.render.drawAttack(aggressorUnit, defenderUnit);
        aggressorUnit.setDidAttack(true);
        aggressorUnit.setDamageGiven(state.aggressor.damage.given);
        defenderUnit.setDamageReceived(state.defender.damage.received);

        if (state.defender.hitPoints === 0) {
            // defenderUnit.setHitPoints(0);
            const defenderUnitGuideData = defenderUnit.getGuideData();

            if (defenderUnitGuideData.hasGrave === true) {
                const currentDefenderGrave =
                    find(game.graveList, {
                        attr: {x: defenderUnit.attr.x, y: defenderUnit.attr.y},
                    }) || null;

                if (currentDefenderGrave === null) {
                    game.createGrave({
                        x: defenderUnit.attr.x,
                        y: defenderUnit.attr.y,
                        removeCountdown: defaultUnitData.graveRemoveCountdown,
                    });
                } else {
                    currentDefenderGrave.setRemoveCountdown(defaultUnitData.graveRemoveCountdown);
                }
            }

            game.removeUnit(defenderUnit);

            await aggressorUnit.actualizeLevel();

            await game.onUnitClick(aggressorUnit);

            return Promise.resolve();
        }

        await defenderUnit.setHitPoints(state.defender.hitPoints);
        defenderUnit.setPoisonCountdown(state.defender.poisonCountdown);

        if (state.defender.canAttack === false) {
            console.log('defender can NOT attack');

            await aggressorUnit.actualizeLevel();

            await game.onUnitClick(aggressorUnit);

            return Promise.resolve();
        }

        await game.render.drawAttack(defenderUnit, aggressorUnit);
        defenderUnit.setDidAttack(true);
        defenderUnit.setDamageGiven(state.defender.damage.given);
        aggressorUnit.setDamageReceived(state.aggressor.damage.received);

        // aggressor isn't alive
        if (state.aggressor.hitPoints === 0) {
            // aggressorUnit.setHitPoints(0);
            const aggressorUnitGuideData = aggressorUnit.getGuideData();

            if (aggressorUnitGuideData.hasGrave === true) {
                const currentAggressorGrave =
                    find(game.graveList, {
                        attr: {x: aggressorUnit.attr.x, y: aggressorUnit.attr.y},
                    }) || null;

                if (currentAggressorGrave === null) {
                    game.createGrave({
                        x: aggressorUnit.attr.x,
                        y: aggressorUnit.attr.y,
                        removeCountdown: defaultUnitData.graveRemoveCountdown,
                    });
                } else {
                    currentAggressorGrave.setRemoveCountdown(defaultUnitData.graveRemoveCountdown);
                }
            }

            game.removeUnit(aggressorUnit);

            await defenderUnit.actualizeLevel();

            return Promise.resolve();
        }

        await aggressorUnit.setHitPoints(state.aggressor.hitPoints);
        aggressorUnit.setPoisonCountdown(state.aggressor.poisonCountdown);

        await aggressorUnit.actualizeLevel();
        await defenderUnit.actualizeLevel();

        await game.onUnitClick(aggressorUnit);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements
    async handleServerPushStateFixBuilding(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'fix-building') {
            console.error('here is should be a fix-building type', message);
            return Promise.resolve();
        }

        if (!state.building) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.log('building is not define', message);
            return Promise.resolve();
        }

        const mapBuilding = state.building;

        const gameBuilding = find(game.buildingList, {attr: {x: mapBuilding.x, y: mapBuilding.y}}) || null;

        if (gameBuilding === null) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        const gameUnit = find(game.unitList, {attr: {x: mapBuilding.x, y: mapBuilding.y}}) || null;

        if (gameUnit === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        gameBuilding.setType(mapBuilding.type);
        gameUnit.setDidFixBuilding(true);

        await game.onUnitClick(gameUnit);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, id-length
    async handleServerPushStateOccupyBuilding(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'occupy-building') {
            console.error('here is should be a occupy-building type', message);
            return Promise.resolve();
        }

        if (!state.building) {
            console.log('building is not define', message);
            return Promise.resolve();
        }

        const mapBuilding = state.building;

        const gameBuilding = find(game.buildingList, {attr: {x: mapBuilding.x, y: mapBuilding.y}}) || null;

        if (gameBuilding === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        const gameUnit = find(game.unitList, {attr: {x: mapBuilding.x, y: mapBuilding.y}}) || null;

        if (gameUnit === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        if (isNotString(mapBuilding.userId)) {
            console.error('userId is not defined', message);
            return Promise.resolve();
        }

        gameBuilding.setUserId(mapBuilding.userId);
        gameUnit.setDidOccupyBuilding(true);

        await game.onUnitClick(gameUnit);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, id-length
    async handleServerPushStateRaiseSkeleton(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'raise-skeleton') {
            console.error('here is should be a raise-skeleton type', message);
            return Promise.resolve();
        }

        if (!state.raiser) {
            console.log('raiser is not define', message);
            return Promise.resolve();
        }

        if (!state.grave) {
            console.log('grave is not define', message);
            return Promise.resolve();
        }

        const mapGrave = state.grave;
        const gameGrave = find(game.graveList, {attr: {x: mapGrave.x, y: mapGrave.y}}) || null;

        if (gameGrave === null) {
            console.error('can not find grave for message', message);
            return Promise.resolve();
        }

        const mapRaiser = state.raiser;
        const gameRaiser = find(game.unitList, {attr: {x: mapRaiser.x, y: mapRaiser.y}}) || null;

        if (gameRaiser === null) {
            console.error('can not find raiser for message', message);
            return Promise.resolve();
        }

        if (isNotFunction(gameRaiser.setDidRaiseSkeleton)) {
            console.error('raiser has not method setDidRaiseSkeleton', message);
            return Promise.resolve();
        }

        gameRaiser.setDidRaiseSkeleton(true);

        game.removeGrave(gameGrave);

        const newSkeleton = game.createUnit({
            x: mapGrave.x,
            y: mapGrave.y,
            type: 'skeleton',
            userId: mapRaiser.userId,
            id: mapRaiser.newUnitId,
            action: {
                didAttack: true,
                didMove: true,
            },
        });

        await game.onUnitClick(gameRaiser);
        await game.onUnitClick(newSkeleton);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, id-length
    async handleServerPushStateDestroyBuilding(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'destroy-building') {
            console.error('here is should be a destroy-building type', message);
            return Promise.resolve();
        }

        if (!state.building) {
            console.error('building is not define', message);
            return Promise.resolve();
        }

        if (!state.destroyer) {
            console.error('destroyer is not define', message);
            return Promise.resolve();
        }

        const mapBuilding = state.building;
        const gameBuilding = find(game.buildingList, {attr: {x: mapBuilding.x, y: mapBuilding.y}}) || null;

        if (gameBuilding === null) {
            console.error('can not find building for message', message);
            return Promise.resolve();
        }

        const mapDestroyer = state.destroyer;

        const gameDestroyer = find(game.unitList, {attr: {x: mapDestroyer.x, y: mapDestroyer.y}}) || null;

        if (gameDestroyer === null) {
            console.error('can not find destroyer for message', message);
            return Promise.resolve();
        }

        if (isNotFunction(gameDestroyer.setDidDestroyBuilding)) {
            console.error('destroyer has not method setDidDestroyBuilding', message);
            return Promise.resolve();
        }

        gameDestroyer.setDidDestroyBuilding(true);

        await game.render.drawBuildingAttack(gameDestroyer, gameBuilding);

        const destroyerInMap = find(state.map.units, mapDestroyer) || null;

        if (destroyerInMap === null) {
            console.error('NO destroyerInMap');
            return Promise.resolve();
        }

        const givenDamage =
            destroyerInMap.damage && isNumber(destroyerInMap.damage.given) ? destroyerInMap.damage.given : 0;

        gameDestroyer.setDamageGiven(givenDamage);

        gameDestroyer
            .actualizeLevel()
            .then((): void => console.log('level actualized'))
            .catch((error: Error) => {
                console.error('error with actualizeLevel()');
                console.error(error);
            });

        gameBuilding.setAttr({
            type: mapBuilding.type,
            x: mapBuilding.x,
            y: mapBuilding.y,
            id: mapBuilding.id,
        });

        await game.onUnitClick(gameDestroyer);

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, id-length
    async handleServerPushStateBuyUnit(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'buy-unit') {
            console.error('here is should be a buy-unit type', message);
            return Promise.resolve();
        }

        if (!state.newMapUnit) {
            console.error('newMapUnit is not define', message);
            return Promise.resolve();
        }

        const newGameUnit = game.createUnit(state.newMapUnit);

        const isMyUnit = newGameUnit.getUserId() === user.getId();

        if (isMyUnit) {
            await game.onUnitClick(newGameUnit);
            return Promise.resolve();
        }

        // await game.render.moveWorldTo(newGameUnit.attr.x, newGameUnit.attr.y);

        /*
        const wrongStateList = getWrongStateList(game.getGameData());

        if (wrongStateList !== null) {
            await game.showWrongState(wrongStateList[0]);
        }
        */

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements, id-length
    async handleServerPushStateSyncMapWithServerUserList(message: SocketMessagePushStateType): Promise<void> {
        const game = this;
        const state = message.states.last.state;

        if (state.type !== 'sync-map-with-server-user-list') {
            console.error('here is should be a sync-map-with-server-user-list', message);
            return Promise.resolve();
        }

        const gameUnitList = game.unitList;
        const gameBuildingList = game.buildingList;

        const mapState = state.map;

        mapState.userList.forEach((mapUser: MapUserType) => {
            if (mapUser.isLeaved === false) {
                return;
            }

            const leavedUserId = mapUser.userId;

            gameUnitList
                .filter((gameUnit: Unit): boolean => gameUnit.getUserId() === leavedUserId)
                .forEach((gameUnit: Unit) => {
                    game.removeUnit(gameUnit);
                });

            gameBuildingList
                .filter((gameBuilding: Building): boolean => gameBuilding.getUserId() === leavedUserId)
                .forEach((gameBuilding: Building) => {
                    gameBuilding.setNoManAttr();
                });
        });

        return Promise.resolve();
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity
    async handleServerRefreshUnitList(message: SocketMessagePushStateType) {
        const game = this;
        const {unitList} = game;
        const socketMapState = message.states.last.state.map;

        // check unit length
        const isUnitListLengthEqual = socketMapState.units.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            console.error('Unit List Length is not equal', socketMapState, unitList);
            return;
        }

        // eslint-disable-next-line complexity
        unitList.forEach((unit: Unit) => {
            const unitId = unit.attr.id;

            if (isNotString(unitId) || unitId === '') {
                console.error('Unit has no id:', unitId);
                return;
            }

            const mapUnit = find(socketMapState.units, {id: unitId});

            if (!mapUnit) {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                console.error('Map unit with id:', unitId, 'is not exist on pushed map');
                return;
            }

            const isUnitEqual = isEqual(mapUnit, unit.attr);

            if (isUnitEqual === true) {
                // console.log('units is equal', mapUnit, unit);
                return;
            }

            unit.decreasePoisonCountdown();

            if (unit.getUserId() === socketMapState.activeUserId) {
                const healHitPointOnBuilding = countHealHitPointOnBuilding(
                    socketMapState,
                    JSON.parse(JSON.stringify(unit.attr))
                );

                if (healHitPointOnBuilding !== null) {
                    unit.setHitPoints(unit.getHitPoints() + healHitPointOnBuilding)
                        .then((): void => console.log('unit.setHitPoints - done'))
                        .catch((error: Error) => {
                            console.error('error with unit.setHitPoints');
                            console.error(error);
                        });
                }
            }

            unit.setActionState(mapUnit.action || null)
                .then((): void => console.log('unit.setActionState - done'))
                .catch((error: Error) => {
                    console.error('error with unit.setActionState');
                    console.error(error);
                });
        });

        const {graveList} = game;

        const graveListToRemove = [];

        // eslint-disable-next-line complexity
        graveList.forEach((grave: Grave) => {
            const mapGrave = find(socketMapState.graves, {x: grave.attr.x, y: grave.attr.y});

            if (!mapGrave) {
                if (grave.attr.removeCountdown === 1) {
                    console.log('grave', grave, 'will remove');
                    graveListToRemove.push(grave);
                    return;
                }
                console.error('Map grave with data:', grave, 'has wrong removeCountdown');

                return;
            }

            const isGraveEqual = isEqual(mapGrave, grave.attr);

            if (isGraveEqual === true) {
                console.error('grave can NOT have equal states', mapGrave, grave);
                return;
            }

            grave.setRemoveCountdown(mapGrave.removeCountdown);
        });

        // eslint-disable-next-line no-loops/no-loops
        while (graveListToRemove.length > 0) {
            game.removeGrave(graveListToRemove.pop());
        }
    }

    createBuilding(buildingData: BuildingType) {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('no mapState for createBuilding');
            return;
        }

        const building = new Building({buildingData, userList: mapState.userList});

        game.buildingList.push(building);

        bindClick(
            building.gameAttr.container,
            // eslint-disable-next-line complexity, max-statements
            async () => {
                game.gameView.setActiveLandscape(buildingData.x, buildingData.y);

                if (!game.isMyTurn()) {
                    console.log('click on building: not your turn');
                    return;
                }

                const wrongStateList = getWrongStateList(game.getGameData());

                if (wrongStateList !== null) {
                    await game.showWrongState(wrongStateList[0]);
                    return;
                }

                await game.render.cleanActionsList();

                if (building.attr.type !== mapGuide.building.castle.name) {
                    console.log('NOT a castle');
                    return;
                }

                if (building.attr.userId !== user.getId()) {
                    console.log('NOT your building');
                    return;
                }

                if (game.mapState.activeUserId !== user.getId()) {
                    console.warn('NOT you turn');
                    return;
                }

                if (isStoreOpen()) {
                    console.error('store already open', location.search);
                    return;
                }

                if (!canOpenStore(building.attr.x, building.attr.y, game.getGameData())) {
                    console.log('can not open store from click on building');
                    return;
                }

                console.log('---> open store by building');

                await game.openStore(building.attr.x, building.attr.y);
            }
        );

        game.render.addBuilding(building.gameAttr.container);
    }

    createGrave(graveData: GraveType) {
        const game = this;
        const grave = new Grave({graveData});

        game.graveList.push(grave);

        game.render.addGrave(grave.gameAttr.container);
    }

    removeGrave(grave: Grave) {
        const game = this;
        const graveList = game;

        const lengthBeforeRemove = game.graveList.length;

        game.graveList = game.graveList.filter((graveInList: Grave): boolean => graveInList !== grave);

        const lengthAfterRemove = game.graveList.length;

        // check to remove ONE grave
        if (lengthAfterRemove === lengthBeforeRemove - 1) {
            console.log('grave did removed successfully');
        } else {
            console.error('grave did NOT removed', grave, graveList);
        }

        game.render.layer.graves.removeChild(grave.gameAttr.container);
        grave.destroy();
    }

    createUnit(unitData: UnitType): Unit {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('no mapState for createUnit');
        }

        const unit = unitMaster.createUnit({
            unitData,
            userList: mapState === null ? [] : mapState.userList,
            event: {
                click: async (clickedUnit: Unit) => {
                    game.gameView.setActiveLandscape(clickedUnit.attr.x, clickedUnit.attr.y);

                    if (!game.isMyTurn()) {
                        console.log('click on unit: not your turn');
                        return;
                    }

                    await game.onUnitClick(clickedUnit);
                },
                hold: async (clickedUnit: Unit) => {
                    await game.onUnitHold(clickedUnit);
                },
            },
        });

        game.unitList.push(unit);

        game.render.addUnit(unit.gameAttr.container);

        return unit;
    }

    removeUnit(unit: Unit) {
        const game = this;
        const unitList = game.unitList;

        const lengthBeforeRemove = game.unitList.length;

        game.unitList = game.unitList.filter((unitInList: Unit): boolean => unitInList !== unit);

        const lengthAfterRemove = game.unitList.length;

        // check to remove ONE unit
        if (lengthAfterRemove === lengthBeforeRemove - 1) {
            console.log('unit did removed successfully');
        } else {
            console.error('unit did NOT removed', unit, unitList);
        }

        // console.warn('Add/update grave here is needed');

        game.render.layer.units.removeChild(unit.gameAttr.container);
        unit.destroy();
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async onUnitClick(unit: Unit) {
        const game = this;
        const unitAttr = unit.getAttr();
        const unitUserId = isString(unitAttr.userId) ? unitAttr.userId : null;
        const gameData = game.getGameData();
        const wrongStateList = getWrongStateList(gameData);

        if (wrongStateList !== null) {
            await game.showWrongState(wrongStateList[0]);
            return;
        }

        if (unitUserId === null) {
            console.error('userId is not exists in unit', unit);
            return;
        }

        const {activeUserId} = gameData;

        if (unitUserId !== user.getId() || unitUserId !== activeUserId) {
            console.log('you click on NOT your unit');

            if (canOpenStore(unitAttr.x, unitAttr.y, gameData) && !activeUserId.startsWith('bot')) {
                console.log('open store under enemy unit');
                await game.openStore(unitAttr.x, unitAttr.y);
            }
            return;
        }

        // get unit's action
        const unitActionsList = unit.getActions(gameData);

        if (unitActionsList === null) {
            console.log('---> unit already done - set unit GRAY state');
            unit.setIsActionAvailable(false);
        }

        const openStoreActionList = unit.getOpenStoreActions(gameData);

        /* you can add logic for openStoreActionList here */

        const mergedActionList = mergeActionList(unitActionsList, openStoreActionList);

        if (mergedActionList === null) {
            await game.render.cleanActionsList();
            return;
        }

        await game.render.drawActionsList(mergedActionList);

        mergedActionList.forEach((unitActionLine: Array<Array<UnitActionType>>) => {
            unitActionLine.forEach((unitActionList: Array<UnitActionType>) => {
                unitActionList.forEach((unitAction: UnitActionType) => {
                    if (!unitAction.container) {
                        console.error('no container to add onClick', unitAction);
                        return;
                    }
                    bindClick(
                        unitAction.container,
                        // eslint-disable-next-line complexity
                        async () => {
                            switch (unitAction.type) {
                                case 'move':
                                    if (unitActionsList !== null) {
                                        await game.bindOnClickUnitActionMove(unitAction, unitActionsList, user.getId());
                                        game.gameView.setActiveLandscape(unitAction.to.x, unitAction.to.y);
                                    }
                                    break;

                                case 'attack':
                                    await game.bindOnClickUnitActionAttack(unitAction, user.getId());
                                    break;

                                case 'fix-building':
                                    await game.bindOnClickUnitActionFixBuilding(unitAction, user.getId());
                                    break;

                                case 'occupy-building':
                                    await game.bindOnClickUnitActionOccupyBuilding(unitAction, user.getId());
                                    break;

                                case 'raise-skeleton':
                                    await game.bindOnClickUnitActionRaiseSkeleton(unitAction, user.getId());
                                    break;

                                case 'destroy-building':
                                    await game.bindOnClickUnitActionDestroyBuilding(unitAction, user.getId());
                                    break;

                                case 'open-store':
                                    await game.bindOnClickUnitActionOpenStore(unitAction);
                                    break;

                                default:
                                    console.error('unknown action', unitAction);
                            }
                        },
                        // eslint-disable-next-line no-sync
                        (): void => game.render.cleanActionsListSync()
                    );
                });
            });
        });
    }

    async onUnitHold(unit: Unit) {
        const game = this;

        game.gameView.showUnitInfoPopup(unit);
    }

    async showWrongState(wrongState: WrongStateType) {
        const game = this;

        if (wrongState.type === 'unit-on-unit') {
            await game.showWrongStateUnitOnUnit(wrongState);
            return;
        }

        console.error('unknow wrong state', wrongState);
    }

    async showWrongStateUnitOnUnit(wrongState: WrongStateTypeUnitOnUnitType) {
        const game = this;

        console.log('show wrong state', wrongState);

        const unit =
            findLast(
                game.unitList,
                (unitInList: Unit): boolean => unitInList.attr.x === wrongState.x && unitInList.attr.y === wrongState.y
            ) || null;

        if (unit === null) {
            console.log('can not find unit with for wrong state', wrongState);
            return;
        }

        const moveActionList = unit.getMoveActions(game.getGameData());

        await game.render.drawActionsList(moveActionList);
        await game.render.moveWorldTo(unit.attr.x, unit.attr.y);

        moveActionList.forEach((unitActionLine: Array<Array<UnitActionType>>) => {
            unitActionLine.forEach((unitActionList: Array<UnitActionType>) => {
                unitActionList.forEach((unitAction: UnitActionType) => {
                    if (!unitAction.container) {
                        return;
                    }

                    bindClick(unitAction.container, async () => {
                        if (unitAction.type !== 'move') {
                            return;
                        }
                        await game.bindOnClickUnitActionMove(unitAction, moveActionList, user.getId());
                    });
                });
            });
        });
    }

    // eslint-disable-next-line complexity, max-statements
    async bindOnClickUnitActionMove(
        unitAction: UnitActionMoveType,
        actionsList: UnitActionsMapType,
        activeUserId: string
    ) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionMove');
            return;
        }

        const movedUnit = find(newMap.units, {id: unitAction.id});

        if (!movedUnit) {
            console.error('--> can not find unit for action:', unitAction);
            return;
        }

        const gameUnit = find(game.unitList, {attr: {id: unitAction.id}}) || null;

        if (gameUnit === null) {
            console.error('--> can not find game unit for action:', unitAction);
            return;
        }

        const moviePath = gameUnit.getMoviePath(unitAction, actionsList, game.getGameData());

        if (moviePath === null) {
            console.error('moviePath is not define, actually === null');
            return;
        }

        // update map movie unit
        movedUnit.x = unitAction.to.x;
        movedUnit.y = unitAction.to.y;

        movedUnit.action = movedUnit.action || {};
        movedUnit.action.didMove = true;

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'move',
                    path: moviePath,
                    from: {
                        x: unitAction.from.x,
                        y: unitAction.from.y,
                    },
                    to: {
                        x: unitAction.to.x,
                        y: unitAction.to.y,
                    },
                    unit: {
                        id: unitAction.id,
                    },
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action move pushed', response))
            .catch((error: Error) => {
                console.error('error with refresh unit action move pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.error(error);
            });
    }

    // eslint-disable-next-line complexity, max-statements, sonarjs/cognitive-complexity
    async bindOnClickUnitActionAttack(unitAction: UnitActionAttackType, activeUserId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionAttack');
            return;
        }

        const aggressorMapUnit = find(newMap.units, {id: unitAction.aggressor.id});

        if (!aggressorMapUnit) {
            console.error('--> can not find aggressorMapUnit for action:', unitAction);
            return;
        }

        const defenderMapUnit = find(newMap.units, {id: unitAction.defender.id});

        if (!defenderMapUnit) {
            console.error('--> can not find defenderMapUnit for action:', unitAction);
            return;
        }

        const aggressorActionUnit = unitAction.aggressor;
        const defenderActionUnit = unitAction.defender;

        if (aggressorActionUnit.canAttack) {
            const aggressorMapUnitAction = aggressorMapUnit.action || {};

            aggressorMapUnitAction.didAttack = true;
            aggressorMapUnit.action = aggressorMapUnitAction;

            aggressorMapUnit.damage = aggressorMapUnit.damage || {};
            aggressorMapUnit.damage.given = aggressorActionUnit.damage.given;
            defenderMapUnit.damage = defenderMapUnit.damage || {};
            defenderMapUnit.damage.received = defenderActionUnit.damage.received;

            if (defenderActionUnit.hitPoints === 0) {
                defenderMapUnit.hitPoints = 0;
                newMap.units = newMap.units.filter(
                    (mapUnit: UnitType): boolean => mapUnit.id !== defenderActionUnit.id
                );
                procedureMakeGraveForMapUnit(newMap, defenderActionUnit);
            } else {
                defenderMapUnit.hitPoints = defenderActionUnit.hitPoints;
                defenderMapUnit.poisonCountdown = defenderActionUnit.poisonCountdown;
            }
        } else {
            console.error('aggressor can NOT attack', unitAction);
            return;
        }

        if (defenderActionUnit.canAttack && isNumber(defenderMapUnit.hitPoints) && defenderMapUnit.hitPoints > 0) {
            const defenderMapUnitAction = defenderMapUnit.action || {};

            defenderMapUnitAction.didAttack = true;
            defenderMapUnit.action = defenderMapUnitAction;

            defenderMapUnit.damage = defenderMapUnit.damage || {};
            defenderMapUnit.damage.given = defenderActionUnit.damage.given;
            aggressorMapUnit.damage = aggressorMapUnit.damage || {};
            aggressorMapUnit.damage.received = aggressorActionUnit.damage.received;

            if (aggressorActionUnit.hitPoints === 0) {
                aggressorMapUnit.hitPoints = 0;
                newMap.units = newMap.units.filter(
                    (mapUnit: UnitType): boolean => mapUnit.id !== aggressorActionUnit.id
                );
                procedureMakeGraveForMapUnit(newMap, aggressorActionUnit);
            } else {
                aggressorMapUnit.hitPoints = aggressorActionUnit.hitPoints;
                aggressorMapUnit.poisonCountdown = aggressorActionUnit.poisonCountdown;
            }
        } else {
            console.log('defenderUnitAction can NOT strike back');
        }

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'attack',
                    aggressor: unitAction.aggressor,
                    defender: unitAction.defender,
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action attack pushed', response))
            .catch((error: Error) => {
                console.error('error with unit action attack pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.log(error);
            });
    }

    // eslint-disable-next-line max-statements, complexity
    async bindOnClickUnitActionFixBuilding(unitAction: UnitActionFixBuildingType, activeUserId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionFixBuilding');
            return;
        }

        const building = find(newMap.buildings, {x: unitAction.x, y: unitAction.y}) || null;

        if (building === null) {
            console.error('can not find building for unit action', unitAction);
            return;
        }

        const fixerUnit = find(newMap.units, {x: unitAction.x, y: unitAction.y}) || null;

        if (fixerUnit === null) {
            // eslint-disable-next-line sonarjs/no-duplicate-string
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        fixerUnit.action = fixerUnit.action || {};
        fixerUnit.action.didFixBuilding = true;

        building.type = mapGuide.building.farm.name;

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'fix-building',
                    building,
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action fix building pushed', response))
            .catch((error: Error) => {
                console.error('error with unit action fix building pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.log(error);
            });
    }

    // eslint-disable-next-line max-statements, complexity
    async bindOnClickUnitActionOpenStore(unitAction: UnitActionOpenStoreType) {
        const game = this;

        console.log('---> open store by bindOnClickUnitActionOpenStore');

        await game.openStore(unitAction.x, unitAction.y);
    }

    // eslint-disable-next-line max-statements, complexity, id-length
    async bindOnClickUnitActionOccupyBuilding(unitAction: UnitActionOccupyBuildingType, activeUserId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionOccupyBuilding');
            return;
        }

        const building = find(newMap.buildings, {x: unitAction.x, y: unitAction.y}) || null;

        if (building === null) {
            console.error('can not find building for unit action', unitAction);
            return;
        }

        const occuperUnit = find(newMap.units, {x: unitAction.x, y: unitAction.y}) || null;

        if (occuperUnit === null) {
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        occuperUnit.action = occuperUnit.action || {};
        occuperUnit.action.didOccupyBuilding = true;

        building.userId = unitAction.userId;

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'occupy-building',
                    building,
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action occupy building pushed', response))
            .catch((error: Error) => {
                console.error('error with unit action occupy building pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.log(error);
            });
    }

    // eslint-disable-next-line max-statements, complexity, id-length
    async bindOnClickUnitActionRaiseSkeleton(unitAction: UnitActionRaiseSkeletonType, activeUserId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionRaiseSkeleton');
            return;
        }

        const actionGrave = unitAction.grave;
        const actionRaiser = unitAction.raiser;

        const raiserMapUnit = find(newMap.units, {x: actionRaiser.x, y: actionRaiser.y, id: actionRaiser.id}) || null;

        if (raiserMapUnit === null) {
            console.error('can not find unit for unit action', unitAction);
            return;
        }

        raiserMapUnit.action = raiserMapUnit.action || {};
        raiserMapUnit.action.didRaiseSkeleton = true;

        const graveMap = find(newMap.graves, {x: actionGrave.x, y: actionGrave.y}) || null;

        if (graveMap === null) {
            console.error('can not find grave for unit action', unitAction);
            return;
        }

        newMap.graves = newMap.graves.filter(
            (grave: GraveType): boolean => grave.x !== actionGrave.x || grave.y !== actionGrave.y
        );

        newMap.units.push({
            x: actionGrave.x,
            y: actionGrave.y,
            type: 'skeleton',
            userId: actionRaiser.userId,
            id: actionRaiser.newUnitId,
            action: {
                didAttack: true,
                didMove: true,
            },
        });

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'raise-skeleton',
                    raiser: actionRaiser,
                    grave: actionGrave,
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action raise skeleton pushed', response))
            .catch((error: Error) => {
                console.error('error with unit action raise skeleton pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.log(error);
            });
    }

    // eslint-disable-next-line max-statements, complexity, id-length
    async bindOnClickUnitActionDestroyBuilding(unitAction: UnitActionDestroyBuildingType, activeUserId: string) {
        const game = this;

        await game.render.cleanActionsList();

        const newMap = game.getMapState();

        if (newMap === null) {
            console.error('no mapState for bindOnClickUnitActionDestroyBuilding');
            return;
        }

        const mapBuilding =
            find(newMap.buildings, {
                x: unitAction.building.x,
                y: unitAction.building.y,
            }) || null;

        if (mapBuilding === null) {
            console.error('can not find building for action', unitAction);
            return;
        }

        const buildingIndex = newMap.buildings.indexOf(mapBuilding);

        if (buildingIndex === -1) {
            console.error('building should be in newMap.Building', unitAction);
            return;
        }

        newMap.buildings[buildingIndex] = {
            x: unitAction.building.x,
            y: unitAction.building.y,
            type: unitAction.building.type,
            id: unitAction.building.id,
        };

        const mapUnit =
            find(newMap.units, {
                x: unitAction.destroyer.x,
                y: unitAction.destroyer.y,
                id: unitAction.destroyer.id,
            }) || null;

        if (mapUnit === null) {
            console.error('can not find destroyer for unit action', unitAction);
            return;
        }

        mapUnit.action = mapUnit.action || {};
        mapUnit.action.didDestroyBuilding = true;

        mapUnit.damage = mapUnit.damage || {};
        mapUnit.damage.given = mapUnit.damage.given || 0;
        mapUnit.damage.given += defaultUnitData.experience.destroyBuilding;

        game.gameView.addDisableReason(disableReasonKeyMap.clientPushState);

        await serverApi
            .pushState(game.roomId, activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'destroy-building',
                    destroyer: unitAction.destroyer,
                    building: unitAction.building,
                    map: newMap,
                    activeUserId,
                },
            })
            .then((response: mixed): void => console.log('---> unit action destroy building pushed', response))
            .catch((error: Error) => {
                console.error('error with unit action destroy building pushed');
                console.log(error);
            })
            .then((): void => game.gameView.removeDisableReason(disableReasonKeyMap.clientPushState))
            .catch((error: Error) => {
                console.error('error with removeDisableReason client-push-state');
                console.log(error);
            });
    }

    setSettings(settings: AllRoomSettingsType) {
        const game = this;

        game.settings = settings;
    }

    setUserList(userList: Array<ServerUserType>) {
        const game = this;

        game.userList = userList;
    }

    setRoomId(roomId: string) {
        const game = this;

        game.roomId = roomId;
    }

    setMapState(map: MapType) {
        const game = this;

        game.mapState = map;
    }

    getMapState(): MapType | null {
        const game = this;

        if (game.mapState) {
            return JSON.parse(JSON.stringify(game.mapState));
        }

        return null;
    }

    setCanvasSize(width: number, height: number) {
        const game = this;

        game.render.setCanvasSize(width, height - bottomBarData.height);
    }

    setGameView(gameView: GameView) {
        const game = this;

        game.gameView = gameView;
    }

    initializePathMaps() {
        const game = this;

        game.initializeEmptyActionMap();
        game.initializeEmptyValueMap();

        game.initializePathMapWalk();
        game.initializePathMapFlow();
        game.initializePathMapFly();

        game.initializeArmorMapWalkAndFly();
        game.initializeArmorMapFlow();
    }

    initializePathMapWalk() {
        const game = this;
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const building = find(map.buildings, {x: tileX, y: tileY}) || null;

                if (building === null) {
                    const landscapeType = getReducedLandscapeType(map, tileX, tileY);
                    const pathReduce = mapGuide.landscape[landscapeType].pathReduce;

                    pathMap[tileY].push(pathReduce);
                    return;
                }

                pathMap[tileY].push(mapGuide.landscapeUnderBuilding.pathReduce);
            });
        });
        game.pathMap.walk = pathMap;
    }

    initializePathMapFlow() {
        const game = this;
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const building = find(map.buildings, {x: tileX, y: tileY}) || null;

                if (building === null) {
                    const landscapeType = getReducedLandscapeType(map, tileX, tileY);
                    const pathReduce = landscapeType === 'water' ? 1 : mapGuide.landscape[landscapeType].pathReduce;

                    pathMap[tileY].push(pathReduce);
                    return;
                }

                pathMap[tileY].push(mapGuide.landscapeUnderBuilding.pathReduce);
            });
        });

        game.pathMap.flow = pathMap;
    }

    initializePathMapFly() {
        const game = this;
        const {map} = game.settings;
        const pathMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            pathMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                pathMap[tileY].push(1);
            });
        });

        game.pathMap.fly = pathMap;
    }

    initializeArmorMapWalkAndFly() {
        const game = this;
        const {map} = game.settings;
        const armorMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            armorMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const building = find(map.buildings, {x: tileX, y: tileY}) || null;

                if (building === null) {
                    const landscapeType = getReducedLandscapeType(map, tileX, tileY);
                    const placeArmor = mapGuide.landscape[landscapeType].armor;

                    armorMap[tileY].push(placeArmor);
                    return;
                }

                armorMap[tileY].push(mapGuide.landscapeUnderBuilding.armor);
            });
        });

        game.armorMap.walk = armorMap;
        game.armorMap.fly = armorMap;
    }

    initializeArmorMapFlow() {
        const game = this;
        const {map} = game.settings;
        const armorMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            armorMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const building = find(map.buildings, {x: tileX, y: tileY}) || null;

                if (building === null) {
                    const landscapeType = getReducedLandscapeType(map, tileX, tileY);
                    const placeArmor =
                        landscapeType === 'water' ?
                            mapGuide.landscape[landscapeType].flowArmor :
                            mapGuide.landscape[landscapeType].armor;

                    armorMap[tileY].push(placeArmor);
                    return;
                }

                armorMap[tileY].push(mapGuide.landscapeUnderBuilding.armor);
            });
        });

        game.armorMap.flow = armorMap;
    }

    initializeEmptyActionMap() {
        const game = this;
        const {map} = game.settings;
        const emptyActionMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            emptyActionMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                emptyActionMap[tileY].push([]);
            });
        });

        game.emptyActionMap = emptyActionMap;
    }

    initializeEmptyValueMap() {
        const game = this;
        const {map} = game.settings;
        const emptyValueMap = [];

        map.landscape.forEach((line: Array<LandscapeType>, tileY: number) => {
            emptyValueMap.push([]);
            line.forEach((landscapeItem: LandscapeType, tileX: number) => {
                emptyValueMap[tileY].push(null);
            });
        });

        game.emptyValueMap = emptyValueMap;
    }

    checkMapStateUnit(socketMapState: MapType) {
        const game = this;
        const {unitList} = game;

        // check unit length
        const isUnitListLengthEqual = socketMapState.units.length === unitList.length;

        if (isUnitListLengthEqual === false) {
            console.error('Unit List Length is not equal', socketMapState, unitList);
            return;
        }

        const isUnitListStateEqual = unitList.every(
            (unit: Unit): boolean => {
                const unitId = unit.attr.id;

                if (isNotString(unitId) || unitId === '') {
                    console.error('Unit has no id:', unitId);
                    return false;
                }

                const mapUnit = find(socketMapState.units, {id: unitId});

                if (!mapUnit) {
                    console.error('Map unit with id:', unitId, 'is not exist on pushed map');
                    return false;
                }

                const isUnitEqual = isEqual(mapUnit, unit.attr);

                if (isUnitEqual === false) {
                    console.error(
                        'units is not equal',
                        JSON.parse(JSON.stringify(mapUnit)),
                        JSON.parse(JSON.stringify(unit.attr))
                    );
                    return false;
                }

                return true;
            }
        );

        if (isUnitListStateEqual === false) {
            console.error('Unit List state is not equal', socketMapState, unitList);
            return;
        }

        console.log('game map unit and push map unit is equal');
    }

    checkMapStateBuilding(socketMapState: MapType) {
        const game = this;
        const {buildingList} = game;

        // check building length
        const isBuildingListLengthEqual = socketMapState.buildings.length === buildingList.length;

        if (isBuildingListLengthEqual === false) {
            console.error('Building List Length is not equal', socketMapState, buildingList);
            return;
        }

        const isBuildingListStateEqual = buildingList.every(
            (building: Building): boolean => {
                const buildingId = building.attr.id;

                if (isNotString(buildingId) || buildingId === '') {
                    console.error('Building has no id:', buildingId);
                    return false;
                }

                const mapBuilding = find(socketMapState.buildings, {id: buildingId});

                if (!mapBuilding) {
                    console.error('Map building with id:', buildingId, 'is not exist on pushed map');
                    return false;
                }

                const isBuildingEqual = isEqual(mapBuilding, building.attr);

                if (isBuildingEqual === false) {
                    console.error('buildings is not equal', mapBuilding, building.attr);
                    return false;
                }

                return true;
            }
        );

        if (isBuildingListStateEqual === false) {
            console.error('Building List state is not equal', socketMapState, buildingList);
            return;
        }

        console.log('game map building and push map building is equal');
    }

    checkMapStateGrave(socketMapState: MapType) {
        const game = this;

        const {graveList} = game;

        // check building length
        const isGraveListLengthEqual = socketMapState.graves.length === graveList.length;

        if (isGraveListLengthEqual === false) {
            console.error('Grave List Length is not equal', socketMapState, graveList);
            return;
        }

        const isGraveListStateEqual = graveList.every(
            (grave: Grave): boolean => {
                const mapGrave = find(socketMapState.graves, {x: grave.attr.x, y: grave.attr.y});

                if (!mapGrave) {
                    console.error(
                        'Map grave with data:',
                        {x: grave.attr.x, y: grave.attr.y},
                        'is not exist on pushed map'
                    );
                    return false;
                }

                const isGraveEqual = isEqual(mapGrave, grave.attr);

                if (isGraveEqual === false) {
                    console.error('graves is not equal', mapGrave, grave.attr);
                    return false;
                }

                return true;
            }
        );

        if (isGraveListStateEqual === false) {
            console.error('Grave List state is not equal', socketMapState, graveList);
            return;
        }

        console.log('game map grave and push map building is equal');
    }

    checkMapState(socketMapState: MapType) {
        const game = this;

        game.checkMapStateUnit(socketMapState);
        game.checkMapStateBuilding(socketMapState);
        game.checkMapStateGrave(socketMapState);
    }

    refreshWispAura() {
        const game = this;

        const gameData = game.getGameData();

        game.unitList.forEach((unit: Unit) => {
            unit.refreshWispAura(gameData);
        });
    }

    getGameData(): GameDataType {
        const game = this;

        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('no map state for getGameData');
        }

        return {
            userList: mapState === null ? [] : mapState.userList,
            activeUserId: mapState === null ? '' : mapState.activeUserId,
            buildingList: game.buildingList,
            unitList: game.unitList,
            graveList: game.graveList,
            unitLimit: mapState === null ? mapGuide.defaultUnitLimitList[0] : mapState.unitLimit,
            pathMap: game.pathMap,
            armorMap: game.armorMap,
            emptyActionMap: game.emptyActionMap,
            emptyValueMap: game.emptyValueMap,
        };
    }

    // eslint-disable-next-line complexity, max-statements
    async detectAndHandleEndGame() {
        const game = this;
        const mapState = game.getMapState();
        const userId = user.getId();

        if (mapState === null) {
            console.error('no mapState for detectAndHandleEndGame');
            return;
        }

        // check me is defeat
        if (isUserDefeat(userId, mapState)) {
            await game.makeEndGame();
            return;
        }

        const matchState = getMatchResult(mapState);

        // if can not detect match state
        if (matchState === null) {
            console.error('matchState is null!!');
            return;
        }

        // if not winner team
        if (matchState.winner.teamId === null) {
            return;
        }

        await game.makeEndGame();
    }

    async makeEndGame() {
        const game = this;
        const {roomId} = game;
        const userId = user.getId();

        game.destroy();

        await serverApi.leaveRoom(roomId, userId);

        game.gameView.showEndGame();
    }

    async loadMapState(map: MapType) {
        // TODO: implement load map state
        console.error('implement load map state');
    }

    async openStore(x: number, y: number) {
        const game = this;

        if (!canOpenStore(x, y, game.getGameData())) {
            return;
        }

        game.gameView.props.setOpenFromGame(true);

        game.gameView.props.history.push('?viewId=' + storeViewId + '&x=' + x + '&y=' + y);

        await game.render.cleanActionsList();
    }

    // eslint-disable-next-line complexity, max-statements
    async makeBotTurn() {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('makeBotTurn - map state for bot is undefined');
            return;
        }

        const {activeUserId} = mapState;

        const gameData = game.getGameData();

        // buy unit by bot
        if (getWrongStateList(gameData) === null && canPlayerBuyUnit(activeUserId, gameData)) {
            const botUnitResult = await botBuyUnit(activeUserId, gameData, mapState, game.roomId);

            if (botUnitResult instanceof Error) {
                console.error('Error with buy unit, drop turn');

                await serverApi.dropTurn(game.roomId, activeUserId);
                return;
            }

            // if botUnitResult === null - unit did NOT buy
            if (botUnitResult !== null) {
                // just for some smooth
                await wait(1e3);

                await game.makeBotTurn();
                return;
            }
        }

        const botTurnData = getBotTurnDataList(mapState, game.getGameData());

        if (botTurnData === null) {
            console.warn('---> NO bot\'s turn data, you need to drop bot\'s turn');
            await serverApi.dropTurn(game.roomId, activeUserId);
            return;
        }

        const [firstBotResultActionData] = botTurnData;
        const {unitAction, moveAction} = firstBotResultActionData;

        if (unitAction === null && moveAction.action === null && moveAction.actionsMap === null) {
            await serverApi.dropTurn(game.roomId, activeUserId);
            console.log('---> no action data and move data ---- drop turn');
            return;
        }

        await game.executeBotResultAction(firstBotResultActionData);

        // just for some smooth
        await wait(1e3);

        await game.makeBotTurn();
    }

    // eslint-disable-next-line complexity
    async executeBotResultAction(botResultAction: BotResultActionDataType) {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('executeBotResultAction - map state for bot is undefined');
            return;
        }

        const {activeUserId} = mapState;

        const {unitAction} = botResultAction;

        await game.executeBotResultActionMove(botResultAction);

        if (unitAction === null) {
            console.log('BotResultActionData has no unit action');
            return;
        }

        switch (unitAction.type) {
            case 'attack':
                await game.bindOnClickUnitActionAttack(unitAction, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(
                    (defaultUnitData.animation.attack +
                        defaultUnitData.animation.deltaHitPoints +
                        defaultUnitData.animation.levelUp) *
                        2 +
                        500
                );

                break;

            case 'fix-building':
                await game.bindOnClickUnitActionFixBuilding(unitAction, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(500);

                break;

            case 'occupy-building':
                await game.bindOnClickUnitActionOccupyBuilding(unitAction, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(500);

                break;

            case 'raise-skeleton':
                await game.bindOnClickUnitActionRaiseSkeleton(unitAction, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(500);

                break;

            case 'destroy-building':
                await game.bindOnClickUnitActionDestroyBuilding(unitAction, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(3e3);

                break;

            case 'buy-unit':
                // this code will never execute, but needed to detect bot's actions
                console.log('bot buy unit');

                await wait(500);
                break;

            default:
                console.error('---> NO bot\'s support action, drop turn', botResultAction);
                await serverApi.dropTurn(game.roomId, activeUserId);

                // TODO: BOT: subscribe for push state move and move end
                // wait for apply move
                await wait(3000);

                return;
        }

        // get unit's action
        const unitActionsList = botResultAction.unit.getActions(game.getGameData());

        if (unitActionsList === null) {
            console.log('---> executeBotResultAction - unit already done - set unit GRAY state');
            botResultAction.unit.setIsActionAvailable(false);
        }
    }

    // eslint-disable-next-line max-statements
    async executeBotResultActionMove(botResultAction: BotResultActionDataType) {
        const game = this;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('executeBotResultActionMove - map state for bot is undefined');
            return;
        }

        const {activeUserId} = mapState;

        const {moveAction} = botResultAction;

        const {action, actionsMap} = moveAction;

        if (action === null) {
            console.log('---> no move action before unitAction');
            return;
        }

        if (actionsMap === null) {
            console.log('---> no move actionsMap before unitAction');
            return;
        }

        await game.bindOnClickUnitActionMove(action, actionsMap, activeUserId);

        // TODO: BOT: subscribe for push state move and move end
        // wait for apply move
        await wait(1e3);

        // get unit's action
        const unitActionsList = botResultAction.unit.getActions(game.getGameData());

        if (unitActionsList === null) {
            console.log('---> executeBotResultActionMove - unit already done - set unit GRAY state');
            botResultAction.unit.setIsActionAvailable(false);
        }
    }

    destroy() {
        const game = this;

        game.model.destroy();

        localSocketIoClient.removeAllListeners();
    }
}
