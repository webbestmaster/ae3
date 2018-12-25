// @flow

/* global alert */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {user} from '../../module/user';
import type {SocketMessageType} from '../../module/socket';
import {socket} from '../../module/socket';
import type {GlobalStateType} from '../../redux-store-provider/reducer';
import type {SystemType} from '../system/reducer/root';
import {GameModel} from './model/model-game';
import type {ServerUserType} from '../../module/server-api';
import * as serverApi from '../../module/server-api';
import MainModel from 'main-model';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import withRouter from 'react-router-dom/withRouter';
import {Store} from '../store/c-store';
import queryString from 'query-string';
import {
    getMatchResult,
    getSupplyState,
    getUserColor,
    getWrongStateList,
    isOnLineRoomType,
    isUserDefeat,
} from './model/helper';
import style from './style.scss';
import classNames from 'classnames';
import serviceStyle from '../../../css/service.scss';
import {Dialog} from '../ui/dialog/c-dialog';
import {DialogHeader} from '../ui/dialog/dialog-header/c-dialog-header';
import {Page} from '../ui/page/c-page';
import {BottomBar} from '../ui/bottom-bar/c-bottom-bar';
import find from 'lodash/find';
import {localSocketIoClient} from '../../module/socket-local';
import type {UserColorType} from '../../maps/map-guide';
import {LandscapeInfo} from './ui/landscape-info/c-landscape-info';
import iconMoney from './i/bottom-bar/money.png';
import iconUnitRed from './i/bottom-bar/unit-red.png';
import iconUnitBlue from './i/bottom-bar/unit-blue.png';
import iconUnitGreen from './i/bottom-bar/unit-green.png';
import iconUnitBlack from './i/bottom-bar/unit-black.png';
import type {SetOpenFromGameType} from '../store/action';
import {setOpenFromGame} from '../store/action';
import {messageConst} from '../../lib/local-server/room/message-const';
import {Queue} from '../../lib/queue/queue';
import {getConfirm} from '../ui/confirm/action';
import type {MapUserType} from '../../maps/type';
import {Unit} from './model/unit/unit';
import {unitGuideData} from './model/unit/unit-guide';
import {Confirm} from '../ui/confirm/c-confirm';
import type {LangKeyType} from '../locale/translation/type';
import {Locale} from '../locale/c-locale';
import {TapToContinueDialogHint} from './ui/tap-to-continue-dialog-hint';
import {getWaitForLangKey} from './ui/helper';
import {SnackBar} from '../snack-bar/c-snack-bar';
import {hideSnackBar, showSnackBar} from '../snack-bar/action';
import {ChangeTurnSnackBar} from './ui/change-turn-snack-bar/c-change-turn-snack-bar';
import {Popup} from '../ui/popup/popup';
import {showPopup} from '../ui/popup/action';
import {UnitInfo} from './ui/unit-info/c-unit-info';

const gameConfirmEventName = 'game-confirm-event-name';
const gameShowPopupEventName = 'game-show-popup-event-name';
const gameChangeTurnEventName = 'game-change-turn-event-name';
const gameChangeTurnSnackBarId = `game-change-turn-snack-bar-id-${Math.random()}`;

const unitIconMap: {[key: UserColorType]: string} = {
    red: iconUnitRed,
    blue: iconUnitBlue,
    green: iconUnitGreen,
    black: iconUnitBlack,
};

const bottomBarColorMap: {[key: UserColorType]: string} = {
    red: style.bottom_bar__color_red,
    blue: style.bottom_bar__color_blue,
    green: style.bottom_bar__color_green,
    black: style.bottom_bar__color_black,
};

export const bottomBarData = {
    height: 53, // $bar-height: 52px; + 1 top border
};

type PassedPropsType = {|
    +roomId: string,
|};

type ReduxPropsType = {
    system: SystemType,
};

type ReduxActionType = {|
    setOpenFromGame: (isOpenFromGame: boolean) => SetOpenFromGameType,
|};

const reduxAction: ReduxActionType = {
    setOpenFromGame,
};

type PropsType = $ReadOnly<$Exact<{|
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
    |}>>;

export type PopupParameterType = {|
    // isOpen: boolean,
    showMoney?: boolean,
    activeUserId: string,
|};

export type DisabledByItemType =
    | 'server-receive-message'
    | 'client-push-state'
    | 'client-drop-turn'
    | 'end-game-popup'
    | 'sync-map-with-server-user-list'
    | 'client-push-state--refresh-unit-list-state';

export const disableReasonKeyMap: {[key: string]: DisabledByItemType} = {
    clientPushState: 'client-push-state',
};

type StateType = {|
    // settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    game: GameModel,
    socketMessageQueue: Queue,
    activeUserId: string,
    socketMessageList: Array<SocketMessageType>,
    disabledByList: Array<DisabledByItemType>,
    popup: {|
        endGame: {|
            isOpen: boolean,
        |},
    |},
    activeLandscapeTile: {|
        x: number,
        y: number,
    |},
    // map: MapType | null
|};

type RefsType = {|
    canvas: {current: HTMLCanvasElement | null},
|};

export class GameView extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;
    node: RefsType;

    constructor() {
        super();

        const view = this;

        view.node = {
            canvas: React.createRef(),
        };

        view.state = {
            userList: [],
            model: new MainModel(),
            game: new GameModel(),
            socketMessageQueue: new Queue(),
            activeUserId: '',
            socketMessageList: [],
            disabledByList: [],
            popup: {
                endGame: {
                    isOpen: false,
                },
            },
            activeLandscapeTile: {
                x: 0,
                y: 0,
            },
        };
    }

    async componentDidMount(): Promise<string> {
        const view = this;
        const {props, state, node} = view;

        const {roomId, system} = props;
        const {game} = state;
        const canvas = node.canvas.current;

        const {settings} = await serverApi.getAllRoomSettings(roomId);
        const {users} = await serverApi.getAllRoomUsers(roomId);

        if (canvas === null) {
            return '';
        }

        // initialize game's data
        game.setSettings(settings);
        game.setUserList(users);
        game.setRoomId(roomId);
        game.setGameView(view);

        // actually initialize game's render
        game.initialize({
            view: canvas,
            width: system.screen.width,
            height: system.screen.height,
            map: settings.map,
        });

        view.popupChangeActiveUser({
            // isOpen: true,
            showMoney: false,
            activeUserId: settings.map.activeUserId,
        });

        view.setState({
            userList: users,
            activeUserId: settings.map.activeUserId,
        });

        game.render.moveToCenter();

        view.bindEventListeners();

        return roomId;
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const view = this;
        const {props, state} = view;

        // check for game is initialized
        if (state.game.render.app) {
            state.game.setCanvasSize(props.system.screen.width, props.system.screen.height);
        }
    }

    createMessageCallBack(message: SocketMessageType | void): () => Promise<void> {
        const view = this;

        return async (): Promise<void> => {
            if (!message) {
                console.error('SocketMessage is not define');
                return;
            }
            await view.onMessage(message);
        };
    }

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model, socketMessageQueue} = state;

        if (isOnLineRoomType()) {
            model.listenTo(socket.attr.model, 'message', (message: SocketMessageType | void) => {
                socketMessageQueue.push(view.createMessageCallBack(message));
            });
        } else {
            localSocketIoClient.on('message', (message: SocketMessageType) => {
                socketMessageQueue.push(view.createMessageCallBack(message));
            });
        }
    }

    // eslint-disable-next-line complexity
    async onMessage(message: SocketMessageType): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {roomId} = props;
        let allUserResponse = null;

        // need just for debug
        view.setState({socketMessageList: [...state.socketMessageList, message]});

        switch (message.type) {
            case messageConst.type.takeTurn:
                view.setState({activeUserId: message.states.last.activeUserId});

                break;

            case messageConst.type.joinIntoRoom:
            case messageConst.type.leaveFromRoom:
            case messageConst.type.userDisconnected:
                allUserResponse = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: allUserResponse.users,
                });

                break;

            case messageConst.type.pushState:
                // view.forceUpdate();
                // view.setState({activeUserId: message.states.last.state.activeUserId});
                // if (message.states.last.state.map) {
                //     view.setState({map: message.states.last.state.map});
                // } else {
                //     console.error('push-state has no map', message);
                // }

                break;

            case messageConst.type.dropTurn:
                break;

            default:
                console.error('---> view - game - unsupported message type: ', message);
        }
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model, game, socketMessageQueue} = state;
        const {roomId} = props;

        const gameData = game.getGameData();
        const {userList} = gameData;

        game.render.destroy();

        game.destroy();

        model.destroy();

        socketMessageQueue.destroy();

        localSocketIoClient.removeAllListeners();

        if (isOnLineRoomType()) {
            await serverApi.leaveRoom(roomId, user.getId());
            return;
        }

        // return to user original id
        user.setId(userList[0].userId);

        await serverApi.leaveRoom(roomId, user.getId());
        await Promise.all(
            userList.map(
                async (userInList: MapUserType): Promise<void> => {
                    await serverApi.leaveRoom(roomId, userInList.userId);
                }
            )
        );
    }

    async endTurn(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model, game} = state;
        const {roomId} = props;
        const wrongStateList = getWrongStateList(game.getGameData());

        if (wrongStateList !== null) {
            await game.showWrongState(wrongStateList[0]);
            // TODO: add snack bar with error state;
            // eslint-disable-next-line no-alert
            alert('Please, resolve a problem:' + JSON.stringify(wrongStateList[0]));
            return Promise.resolve();
        }

        view.addDisableReason('client-drop-turn');

        return serverApi
            .dropTurn(roomId, user.getId())
            .then((): void => console.log('---> dropTurn success'))
            .catch((error: Error) => {
                console.error('Drop turn error');
                console.error(error);
            })
            .then((): void => view.removeDisableReason('client-drop-turn'))
            .catch((error: Error) => {
                console.error('client-drop-turn error');
                console.error(error);
            });
    }

    hasPlayerAvailableAction(): boolean {
        const view = this;
        const {state} = view;
        const {game} = state;
        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('in this state we should be has the map state');
            return false;
        }

        const gameData = game.getGameData();

        const activeUserId = mapState.activeUserId;

        const playerData =
            gameData.userList.find((userData: MapUserType): boolean => userData.userId === activeUserId) || null;

        if (playerData === null) {
            console.error('user was not find, user id', activeUserId);
            return false;
        }

        if (playerData.money >= unitGuideData.soldier.cost) {
            return true;
        }

        const unitList = gameData.unitList.filter(
            (unitInList: Unit): boolean => unitInList.attr.userId === activeUserId
        );

        return unitList.some((unitInList: Unit): boolean => unitInList.getActions(gameData) !== null);
    }

    handleOnClickEndTurn = async (): Promise<void> => {
        const view = this;

        // no available action (unit's action or not enough money)? -> just drop turn
        if (!view.hasPlayerAvailableAction()) {
            await view.endTurn();
            return;
        }

        const isConfirm = await getConfirm(
            <DialogHeader>
                <Locale stringKey={('DROP_TURN_CONFIRM_QUESTION': LangKeyType)}/>
            </DialogHeader>,
            gameConfirmEventName
        );

        if (isConfirm) {
            await view.endTurn();
        }
    };

    addDisableReason(reason: DisabledByItemType) {
        const view = this;

        view.setState(
            (prevState: StateType): StateType => {
                const newDisabledByList = JSON.parse(JSON.stringify(prevState.disabledByList));

                if (newDisabledByList.includes(reason)) {
                    console.warn('--->', reason, 'already exists in newDisabledByList');
                    return prevState;
                }

                newDisabledByList.push(reason);

                // eslint-disable-next-line no-param-reassign
                prevState.disabledByList = newDisabledByList;

                return prevState;
            }
        );
    }

    removeDisableReason(reason: DisabledByItemType) {
        const view = this;

        view.setState(
            (prevState: StateType): StateType => {
                const newDisabledByList = JSON.parse(JSON.stringify(prevState.disabledByList));
                const reasonIndex = newDisabledByList.indexOf(reason);

                if (reasonIndex === -1) {
                    console.error('ERROR: reason is not exists in disabledByList', reason, view);
                    return prevState;
                }

                newDisabledByList.splice(reasonIndex, 1);

                // eslint-disable-next-line no-param-reassign
                prevState.disabledByList = newDisabledByList;

                return prevState;
            }
        );
    }

    showEndGame() {
        const view = this;

        view.addDisableReason('end-game-popup');

        view.setState(
            (prevState: StateType): StateType => {
                // eslint-disable-next-line no-param-reassign
                prevState.popup.endGame.isOpen = true;

                return prevState;
            }
        );
    }

    showUnitInfoPopup(unit: Unit) {
        const view = this;
        const {state} = view;
        const {game} = state;

        showPopup(<UnitInfo unit={unit} gameData={game.getGameData()}/>, gameShowPopupEventName)
            .then((): void => console.log('popup hidden'))
            .catch(
                (error: Error): Error => {
                    console.error('error with hide popup');
                    console.error(error);
                    return error;
                }
            );
    }

    // eslint-disable-next-line complexity, max-statements
    renderEndGameDialog(): Node {
        const view = this;
        const {state} = view;
        const {popup} = state;
        const {game} = state;
        const userId = user.getId();
        const storeState = view.getStoreState();

        if (popup.endGame.isOpen === false || storeState.isOpen) {
            return view.renderEndGameDialogWrapper(null);
        }

        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('No mapState for renderEndGameDialog');
            return view.renderEndGameDialogWrapper(null);
        }

        const isCurrentUserDefeat = isUserDefeat(userId, mapState);

        if (isCurrentUserDefeat) {
            return view.renderEndGameDialogWrapper(<Locale stringKey={('YOU_DEFEAT': LangKeyType)}/>);
        }

        const matchResult = getMatchResult(mapState);

        if (matchResult === null) {
            console.error('to show end game popup game has to have winner');
            return view.renderEndGameDialogWrapper(null);
        }

        const mapUser = find(mapState.userList, {userId}) || null;

        if (mapUser === null) {
            console.error('can not find mapUser with userId', userId, mapState);
            return view.renderEndGameDialogWrapper(null);
        }

        const langKeyResult = matchResult.winner.teamId === mapUser.teamId ? 'YOU_WIN' : 'YOU_DEFEAT';

        return view.renderEndGameDialogWrapper(<Locale stringKey={(langKeyResult: LangKeyType)}/>);
    }

    renderEndGameDialogWrapper(endGameDialogHeader: Node): Node {
        const view = this;
        const {state} = view;
        const {popup} = state;

        return (
            <Dialog key="end-game-dialog" isOpen={popup.endGame.isOpen} onClick={view.handleLeaveGame}>
                <DialogHeader>{endGameDialogHeader}</DialogHeader>
                <TapToContinueDialogHint/>
            </Dialog>
        );
    }

    getStoreState(): {|isOpen: boolean|} {
        const view = this;
        const {props, state} = view;
        const queryData = queryString.parse(props.location.search);

        return {
            isOpen: queryData.viewId === 'store' && /^\d+$/.test(queryData.x) && /^\d+$/.test(queryData.y),
        };
    }

    // to leave game by user, user should close store or other views which use router
    handleLeaveGame = () => {
        const view = this;
        const {props, state} = view;

        props.history.goBack();
    };

    popupChangeActiveUser(changeActiveUser: PopupParameterType) {
        const view = this;

        const snackBarContent = view.getChangeActiveUserSnackBar(changeActiveUser);

        if (snackBarContent === null) {
            console.log('then snack bar content is null');
            return;
        }

        showSnackBar(
            snackBarContent,
            {
                id: `${gameChangeTurnSnackBarId}-${changeActiveUser.activeUserId}`,
                timer: 3e3,
                isModal: false,
            },
            gameChangeTurnEventName
        ).catch(
            (error: Error): Error => {
                console.error('can not hide popup! How?!');
                console.error(error);

                return error;
            }
        );
    }

    createOnClickChangeActiveUserPopup = (changeActiveUser: PopupParameterType): (() => void) => {
        return () => {
            hideSnackBar(`${gameChangeTurnSnackBarId}-${changeActiveUser.activeUserId}`, gameChangeTurnEventName);
        };
    };

    // eslint-disable-next-line complexity, max-statements
    getChangeActiveUserSnackBar(changeActiveUser: PopupParameterType): Node {
        const view = this;
        const {state} = view;
        const {popup} = state;
        const {game} = state;

        if (popup.endGame.isOpen === true) {
            return null;
        }

        const mapState = game.getMapState();

        if (mapState === null) {
            console.log('No show popup for change ActiveUser');
            return null;
        }

        const activeUserId = changeActiveUser.activeUserId;
        const userId = user.getId();

        const mapActiveUser = find(mapState.userList, {userId: activeUserId}) || null;

        if (mapActiveUser === null) {
            console.error('No ActiveUser for getChangeActiveUserSnackBar', activeUserId, mapState);
            return null;
        }

        const earnedMoney = game.getEarnedMoney(activeUserId);

        if (earnedMoney === null) {
            console.error('no earnedMoney for getChangeActiveUserSnackBar', game);
            return null;
        }

        const activeUserColor = getUserColor(activeUserId, mapState.userList);

        if (activeUserColor === null) {
            console.error('no activeUserColor for getChangeActiveUserSnackBar', game);
            return null;
        }

        if (activeUserId === userId) {
            return (
                <ChangeTurnSnackBar
                    onClick={view.createOnClickChangeActiveUserPopup(changeActiveUser)}
                    color={activeUserColor}
                    money={changeActiveUser.showMoney !== false ? earnedMoney : null}
                >
                    <Locale stringKey={('YOUR_TURN': LangKeyType)}/>
                </ChangeTurnSnackBar>
            );
        }

        return (
            <ChangeTurnSnackBar
                onClick={view.createOnClickChangeActiveUserPopup(changeActiveUser)}
                color={activeUserColor}
                money={null}
            >
                <Locale stringKey={getWaitForLangKey(activeUserColor)}/>
            </ChangeTurnSnackBar>
        );
    }

    renderStore(): Node | null {
        const view = this;
        const {props, state} = view;
        const {game} = state;
        const {render} = game;
        const queryData = queryString.parse(props.location.search);

        const storeState = view.getStoreState();

        if (!storeState.isOpen) {
            render.startViewportPluginList();
            return null;
        }

        render.stopViewportPluginList();

        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('No mapState for renderStore');
            return null;
        }

        return (
            <Store key="store" x={parseInt(queryData.x, 10)} y={parseInt(queryData.y, 10)} map={mapState}>
                {view.renderBottomBar()}
            </Store>
        );
    }

    setActiveLandscape(x: number, y: number) {
        const view = this;

        view.setState({activeLandscapeTile: {x, y}});
    }

    // eslint-disable-next-line complexity
    renderBottomBar(): Node {
        const view = this;
        const {state} = view;
        const mapState = state.game.getMapState();

        if (mapState === null) {
            return null;
        }

        const gameData = state.game.getGameData();

        if (gameData === null) {
            return null;
        }

        const activeUserId = isOnLineRoomType() ? user.getId() : mapState.activeUserId;

        const activeUserColor = getUserColor(activeUserId, mapState.userList);
        const mapUserData = find(mapState.userList, {userId: activeUserId}) || null;

        if (activeUserColor === null || mapUserData === null) {
            return null;
        }

        const supplyState = getSupplyState(mapState, activeUserId);

        // &nbsp; after {mapUserData.money} needed cause .ellipsis wrapper reduce shadow on last symbol
        return (
            <div className={style.bottom_bar__wrapper}>
                <LandscapeInfo
                    map={mapState}
                    gameData={gameData}
                    x={state.activeLandscapeTile.x}
                    y={state.activeLandscapeTile.y}
                />
                <BottomBar className={classNames(style.bottom_bar, bottomBarColorMap[activeUserColor])}>
                    <img className={style.bottom_bar__unit} src={unitIconMap[activeUserColor]} alt=""/>
                    <span className={style.bottom_bar__text}>
                        {supplyState.unitCount + '/' + supplyState.unitLimit}
                    </span>
                    <img className={style.bottom_bar__money} src={iconMoney} alt=""/>
                    <span className={style.bottom_bar__text}>
                        {mapUserData.money}
                        &nbsp;
                    </span>
                </BottomBar>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;
        const mapState = state.game.getMapState();

        const mapActiveUserId = mapState === null ? 'no-map-state-no-active-user-id' : mapState.activeUserId;
        const isCanvasDisabled =
            state.activeUserId !== user.getId() || // your/not turn
            mapActiveUserId !== state.activeUserId || // map user id should be the same server active user id
            state.disabledByList.length > 0; // disabledByList should be empty array

        const storeState = view.getStoreState();

        return [
            view.renderStore(),
            <Confirm eventName={gameConfirmEventName} key={gameConfirmEventName}/>,
            <Popup eventName={gameShowPopupEventName} key={gameShowPopupEventName}/>,
            <SnackBar key="change-turn-snack-bar" eventName={gameChangeTurnEventName}/>,
            <Page className={classNames(style.game_page, {[serviceStyle.hidden]: storeState.isOpen})} key="game-page">
                {view.renderEndGameDialog()}

                <div
                    className={classNames(style.end_turn__wrapper, {
                        [style.end_turn__wrapper__disabled]: isCanvasDisabled,
                    })}
                >
                    <button
                        type="button"
                        className={style.end_turn__button}
                        onClick={view.handleOnClickEndTurn}
                        onKeyPress={view.handleOnClickEndTurn}
                    />
                </div>

                <canvas
                    key="canvas"
                    ref={view.node.canvas}
                    style={{
                        pointerEvents: isCanvasDisabled ? 'none' : 'auto',
                        width: props.system.screen.width,
                        height: props.system.screen.height - bottomBarData.height,
                    }}
                />
                {view.renderBottomBar()}
            </Page>,
        ];
    }
}

const ConnectedComponent = withRouter(
    connect(
        (state: GlobalStateType): {} => ({
            system: state.system,
        }),
        reduxAction
    )(GameView)
);

export {ConnectedComponent as Game};
