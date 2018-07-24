// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import type {SocketMessageType} from './../../module/socket';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import type {SystemType} from './../system/reducer';
import Game from './model/index';
import type {ServerUserType} from './../../module/server-api';
import * as serverApi from './../../module/server-api';
import MainModel from './../../lib/main-model';
import type {ContextRouter} from 'react-router-dom';
import withRouter from 'react-router-dom/withRouter';
import Store from './../store';
import queryString from 'query-string';
import {getMatchResult, getSupplyState, getUserColor, getWrongStateList, isOnLineRoomType} from './model/helper';
import style from './style.scss';
import classnames from 'classnames';
import serviceStyle from './../../../css/service.scss';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from 'material-ui/transitions/Slide';
import Page from './../../components/ui/page';
import BottomBar from './../../components/ui/bottom-bar';
import find from 'lodash/find';
import {localSocketIoClient} from './../../module/socket-local';
import type {UserColorType} from './../../maps/map-guide';
import LandscapeInfo from './ui/landscape-info';
import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

import iconMoney from './ui/icon/money.svg';
import iconUnitRed from './ui/icon/unit-red.svg';
import iconUnitBlue from './ui/icon/unit-blue.svg';
import iconUnitGreen from './ui/icon/unit-green.svg';
import iconUnitBlack from './ui/icon/unit-black.svg';
import type {LandscapeType} from './../../maps/type';

const unitIconMap: { [key: UserColorType]: string } = {
    red: iconUnitRed,
    blue: iconUnitBlue,
    green: iconUnitGreen,
    black: iconUnitBlack
};

const bottomBarColorMap: { [key: UserColorType]: string } = {
    red: style.bottom_bar__color_red,
    blue: style.bottom_bar__color_blue,
    green: style.bottom_bar__color_green,
    black: style.bottom_bar__color_black
};

// function Transition(props: mixed): Node {
//     return <Slide direction="up" {...props} />;
// }

export const bottomBarData = {
    height: 52
};

type PropsType = {|
    system: SystemType,
    roomId: string,
    ...ContextRouter
|};

export type PopupParameterType = {|
    isOpen: boolean,
    showMoney?: boolean
|};

export type DisabledByItemType =
    | 'server-receive-message'
    | 'client-push-state'
    | 'client-drop-turn'
    | 'end-game-popup'
    | 'change-active-user-popup'
    | 'sync-map-with-server-user-list';

type StateType = {|
    // settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    game: Game,
    activeUserId: string,
    socketMessageList: Array<SocketMessageType>,
    disabledByList: Array<DisabledByItemType>,
    popup: {|
        endGame: {|
            isOpen: boolean
        |},
        changeActiveUser: {|
            isOpen: boolean,
            showMoney: boolean
        |}
    |},
    activeLandscapeTile: {|
        x: number,
        y: number
    |}
    // map: MapType | null
|};

type RefsType = {|
    canvas: HTMLElement | null
|};

export class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    node: RefsType;

    constructor() {
        super();

        const view = this;

        view.node = {
            canvas: null
        };

        view.state = {
            userList: [],
            model: new MainModel(),
            game: new Game(),
            activeUserId: '',
            socketMessageList: [],
            disabledByList: [],
            popup: {
                endGame: {
                    isOpen: false
                },
                changeActiveUser: {
                    isOpen: false,
                    showMoney: true
                }
            },
            activeLandscapeTile: {
                x: 0,
                y: 0
            }
        };
    }

    async componentDidMount(): Promise<string> {
        const view = this;
        const {props, state, node} = view;

        const {roomId, system} = props;
        const {game} = state;
        const {canvas} = node;

        const {settings} = await serverApi.getAllRoomSettings(roomId);
        const {users} = await serverApi.getAllRoomUsers(roomId);

        if (canvas === null) {
            return '';
        }

        view.setState({
            userList: users,
            activeUserId: settings.map.activeUserId
        });

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
            map: settings.map
        });

        view.popupChangeActiveUser({
            isOpen: true,
            showMoney: false
        });

        /*
        state.game.drawLandscape(settings.settings.map);
        state.game.drawBuildings(settings.settings.map, users.users);
        state.game.drawUnits(settings.settings.map, users.users);
        */

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

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        if (isOnLineRoomType()) {
            model.listenTo(socket.attr.model,
                'message',
                async (message: SocketMessageType): Promise<void> => {
                    await view.onMessage(message);
                }
            );
        } else {
            localSocketIoClient.on('message',
                async (message: SocketMessageType): Promise<void> => {
                    await view.onMessage(message);
                }
            );
        }
    }

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {roomId} = props;
        let allUserResponse = null;

        // need just for debug
        view.setState((prevState: StateType): StateType => {
            prevState.socketMessageList.push(message);
            return prevState;
        });

        switch (message.type) {
            case 'room__take-turn':

                view.setState({activeUserId: message.states.last.activeUserId});

                break;

            case 'room__join-into-room':
            case 'room__leave-from-room':
            case 'room__user-disconnected':
                allUserResponse = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: allUserResponse.users
                });

                break;

            case 'room__push-state':

                // view.forceUpdate();
                // view.setState({activeUserId: message.states.last.state.activeUserId});
                // if (message.states.last.state.map) {
                //     view.setState({map: message.states.last.state.map});
                // } else {
                //     console.error('push-state has no map', message);
                // }

                break;

            case 'room__drop-turn':

                break;

            default:
                console.error('---> view - game - unsupported message type: ', message);
        }
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model, game} = state;
        const {roomId} = props;

        game.destroy();

        model.destroy();

        localSocketIoClient.removeAllListeners();

        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());
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
            window.alert('Please, resolve a problem:' + JSON.stringify(wrongStateList[0])); // eslint-disable-line no-alert
            return Promise.resolve();
        }

        view.addDisableReason('client-drop-turn');

        return serverApi.dropTurn(roomId, user.getId())
            .catch((error: Error) => {
                console.error('Drop turn error');
                console.log(error);
            })
            .then((): void => view.removeDisableReason('client-drop-turn'))
            .catch((error: Error) => {
                console.error('client-drop-turn error');
                console.log(error);
            });
    }

    addDisableReason(reason: DisabledByItemType) {
        const view = this;
        const {props, state} = view;

        view.setState((prevState: StateType): StateType => {
            const newDisabledByList = JSON.parse(JSON.stringify(prevState.disabledByList));

            if (newDisabledByList.includes(reason)) {
                console.warn('--->', reason, 'already exists in newDisabledByList');
                return prevState;
            }

            newDisabledByList.push(reason);

            prevState.disabledByList = newDisabledByList; // eslint-disable-line no-param-reassign

            return prevState;
        });
    }

    removeDisableReason(reason: DisabledByItemType) {
        const view = this;
        const {props, state} = view;

        view.setState((prevState: StateType): StateType => {
            const newDisabledByList = JSON.parse(JSON.stringify(prevState.disabledByList));
            const reasonIndex = newDisabledByList.indexOf(reason);

            if (reasonIndex === -1) {
                console.error('ERROR: reason is not exists in disabledByList', reason, view);
                return prevState;
            }

            newDisabledByList.splice(reasonIndex, 1);

            prevState.disabledByList = newDisabledByList; // eslint-disable-line no-param-reassign

            return prevState;
        });
    }

    showEndGame() {
        const view = this;
        const {props, state} = view;

        view.addDisableReason('end-game-popup');

        view.setState((prevState: StateType): StateType => {
            prevState.popup.endGame.isOpen = true; // eslint-disable-line no-param-reassign

            return prevState;
        });
    }

    renderEndGameDialog(): Node | null { // eslint-disable-line complexity, max-statements
        const view = this;
        const {props, state} = view;
        const {popup} = state;
        const {game} = state;
        const storeState = view.getStoreState();

        if (popup.endGame.isOpen === false || storeState.isOpen) {
            return null;
        }

        const mapState = game.getMapState();

        if (mapState === null) {
            console.error('No mapState for renderEndGameDialog');
            return null;
        }

        const matchResult = getMatchResult(mapState);

        if (matchResult === null) {
            console.error('to show end game popup game has to have winner');
            return null;
        }

        const mapUser = find(mapState.userList, {userId: user.getId()}) || null;

        if (mapUser === null) {
            console.error('can not find mapUser with userId', user.getId(), mapState);
            return null;
        }

        const isWinner = matchResult.winner.teamId === mapUser.teamId;

        return (
            <Dialog
                open={popup.endGame.isOpen}
                // transition={Transition}
                keepMounted
                onClose={() => {
                    view.leaveGame();
                }}
                onClick={() => {
                    view.leaveGame();
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {isWinner ? 'You win!' : 'You loose :('}
                </DialogTitle>
            </Dialog>
        );
    }

    getStoreState(): {| isOpen: boolean |} {
        const view = this;
        const {props, state} = view;
        const queryData = queryString.parse(props.location.search);

        return {
            isOpen: queryData.viewId === 'store' && /^\d+$/.test(queryData.x) && /^\d+$/.test(queryData.y)
        };
    }

    // to leave game by user, user should close store or other views which use router
    leaveGame() {
        const view = this;
        const {props, state} = view;

        props.history.goBack();
    }

    popupChangeActiveUser(state: PopupParameterType) {
        const view = this;

        if (state.isOpen) {
            view.addDisableReason('change-active-user-popup');
        } else {
            view.removeDisableReason('change-active-user-popup');
        }

        view.setState((prevState: StateType): StateType => {
            prevState.popup.changeActiveUser.isOpen = state.isOpen; // eslint-disable-line no-param-reassign
            prevState.popup.changeActiveUser.showMoney = isBoolean(state.showMoney) ? state.showMoney : true; // eslint-disable-line no-param-reassign

            return prevState;
        });
    }

    renderPopupChangeActiveUserDialog(): Node | null { // eslint-disable-line complexity, max-statements
        const view = this;
        const {props, state} = view;
        const {popup} = state;
        const {game} = state;

        if (popup.endGame.isOpen === true) {
            return null;
        }

        const mapState = game.getMapState();

        if (mapState === null) {
            if (popup.changeActiveUser.isOpen) {
                console.error('No show popup for change ActiveUser');
                return null;
            }
            console.log('No show popup for change ActiveUser');
            return null;
        }

        const activeUserId = mapState.activeUserId;
        const userId = user.getId();

        const mapActiveUser = find(mapState.userList, {userId: activeUserId}) || null;

        if (mapActiveUser === null) {
            console.error('No ActiveUser for renderPopupChangeActiveUserDialog', activeUserId, mapState);
            return null;
        }

        const earnedMoney = game.getEarnedMoney(activeUserId);

        if (earnedMoney === null) {
            console.error('no earnedMoney for renderPopupChangeActiveUserDialog', game);
            return null;
        }

        const activeUserColor = getUserColor(activeUserId, mapState.userList);

        if (activeUserColor === null) {
            console.error('no activeUserColor for renderPopupChangeActiveUserDialog', game);
            return null;
        }

        const earnedString = popup.changeActiveUser.showMoney ? ', earned: ' + earnedMoney : '';

        return (
            <Dialog
                open={popup.changeActiveUser.isOpen}
                // transition={Transition}
                keepMounted
                // onClose={() => {
                //     view.popupChangeActiveUser({isOpen: false});
                // }}
                onClick={() => {
                    if (popup.changeActiveUser.isOpen === false) {
                        console.warn('popup.changeActiveUser.isOpen is already CLOSED, you click on popup too fast :)');
                        return;
                    }
                    view.popupChangeActiveUser({
                        isOpen: false
                    });
                }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {activeUserId === userId ?
                        'your turn' + earnedString :
                        'wait for: ' + activeUserColor}
                </DialogTitle>
            </Dialog>
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
            <Store
                key="store"
                x={parseInt(queryData.x, 10)}
                y={parseInt(queryData.y, 10)}
                map={mapState}
            />
        );
    }

    renderBottomBar(): Node { // eslint-disable-line complexity
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
                <BottomBar className={classnames(style.bottom_bar, bottomBarColorMap[activeUserColor])}>
                    <img
                        className={style.bottom_bar__icon}
                        src={unitIconMap[activeUserColor]}
                        alt=""
                    />
                    <span className={style.bottom_bar__text}>
                        {supplyState.unitCount + '/' + supplyState.unitLimit}
                    </span>
                    <img
                        className={style.bottom_bar__icon}
                        src={iconMoney}
                        alt=""
                    />
                    <span className={style.bottom_bar__text}>
                        {mapUserData.money}
                        &nbsp;
                    </span>
                </BottomBar>
            </div>
        );
    }

    render(): Node { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const mapState = state.game.getMapState();

        const mapActiveUserId = mapState === null ? 'no-map-state-no-active-user-id' : mapState.activeUserId;
        const isCanvasDisabled = state.activeUserId !== user.getId() || // your/not turn
            mapActiveUserId !== state.activeUserId || // map user id should be the same server active user id
            state.disabledByList.length > 0; // disabledByList should be empty array

        const storeState = view.getStoreState();

        return (
            [
                view.renderStore(),
                <Page
                    className={classnames(style.game_page, {[serviceStyle.hidden]: storeState.isOpen})}
                    key="game-page"
                >

                    {view.renderEndGameDialog()}
                    {view.renderPopupChangeActiveUserDialog()}

                    {/*
                <h2>server activeUserId: {state.activeUserId}</h2>
                <h3>mapActiveUser: {mapActiveUserId}</h3>

                <h2>server user list:</h2>

                <ReactJson src={state.userList}/>

                <h2>map user list:</h2>

                {mapState ? <ReactJson src={mapState.userList}/> : <h1>no map</h1>}
                */}

                    <div
                        className={classnames(
                            style.end_turn,
                            {[serviceStyle.disabled]: isCanvasDisabled}
                        )}
                        onClick={async (): Promise<void> => {
                            await view.endTurn();
                        }}
                    >
                        {'>|'}
                    </div>

                    {/* <div>{state.activeUserId === user.getId() ? 'YOUR' : 'NOT your'} turn</div>*/}

                    {/*
                <div>mapActiveUserId === state(server).activeUserId :
                    {mapActiveUserId === state.activeUserId ? ' YES' : ' NO'}</div>
                */}

                    {/* <div>{JSON.stringify(state.disabledByList)}</div> */}

                    <canvas
                        key="canvas"
                        ref={(canvas: HTMLElement | null) => {
                            view.node.canvas = canvas;
                        }}
                        style={{
                            // TODO: uncomment this for production
                            // pointerEvents: isCanvasDisabled ? 'none' : 'auto',
                            width: props.system.screen.width,
                            height: props.system.screen.height - bottomBarData.height
                        }}
                    />
                    {view.renderBottomBar()}
                </Page>
            ]
        );
    }
}

export default withRouter(connect(
    (state: GlobalStateType): {} => ({
        system: state.system
    }),
    {
        // setUser
    }
)(GameView));
