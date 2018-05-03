// @flow

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import type {SocketMessageType} from './../../module/socket';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import type {SystemType} from './../system/reducer';
import Game from './model/index';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import * as serverApi from './../../module/server-api';
import MainModel from './../../lib/main-model';
import type {ContextRouter} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import Store from './../store';
import queryString from 'query-string';
import {getSupplyState} from './model/helper';
import style from './style.m.scss';
import classnames from 'classnames';

import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';
import Form from './../../components/ui/form';
import Label from './../../components/ui/label';
import FormHeader from './../../components/ui/form-header';
import Fieldset from './../../components/ui/fieldset';
import BottomBar from './../../components/ui/bottom-bar';
import find from 'lodash/find';

const bottomBarData = {
    height: 64
};

type PropsType = {|
    system: SystemType,
    roomId: string,
    ...ContextRouter
|};

export type DisabledByItemType = 'server-receive-message' | 'client-push-state' | 'client-drop-turn' | 'end-game-popup';

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    game: Game,
    activeUserId: string,
    socketMessageList: Array<SocketMessageType>,
    disabledByList: Array<DisabledByItemType>
    // map: MapType | null
|};

type RefsType = {|
    canvas: HTMLElement
|};

export class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor() {
        super();

        const view = this;

        view.state = {
            userList: [],
            model: new MainModel(),
            game: new Game(),
            activeUserId: '',
            socketMessageList: [],
            disabledByList: []
        };
    }

    async componentDidMount(): Promise<string> {
        const view = this;
        const {props, state, refs} = view;

        const {roomId} = props;

        const {settings} = await serverApi.getAllRoomSettings(roomId);
        const {users} = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            settings,
            userList: users,
            activeUserId: settings.map.activeUserId
        });

        // initialize game's data
        state.game.setSettings(settings);
        state.game.setUserList(users);
        state.game.setRoomId(props.roomId);
        state.game.setGameView(view);

        // actually initialize game's render
        state.game.initialize({
            view: refs.canvas,
            width: props.system.screen.width,
            height: props.system.screen.height
        });

        /*
        state.game.drawLandscape(settings.settings.map);
        state.game.drawBuildings(settings.settings.map, users.users);
        state.game.drawUnits(settings.settings.map, users.users);
        */

        view.bindEventListeners();

        return roomId;
    }

    componentDidUpdate() {
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

        model.listenTo(socket.attr.model,
            'message',
            async (message: SocketMessageType): Promise<void> => {
                await view.onMessage(message);
            }
        );
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

        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());
    }

    async endTurn(): Promise<void> {
        const view = this;
        const {props, state} = view;

        view.addDisableReason('client-drop-turn');

        return serverApi.dropTurn(props.roomId, user.getId())
            .catch((error: Error) => {
                console.error('Drop turn error');
                console.log(error);
            })
            .then(() => {
                view.removeDisableReason('client-drop-turn');
            });
    }

    addDisableReason(reason: DisabledByItemType) {
        const view = this;
        const {props, state} = view;

        view.setState((prevState: StateType): StateType => {
            const newDisabledByList = JSON.parse(JSON.stringify(prevState.disabledByList));

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

    renderSupplyState(): Node {
        const view = this;
        const {props, state} = view;
        const {mapState} = state.game; // do not use game.getMapState(), map stay might undefined in game
        const userId = user.getId();

        if (!mapState) {
            return <div>no map state</div>;
        }

        const supplyState = getSupplyState(mapState, userId);

        return ['Units:', supplyState.unitCount, '/', supplyState.unitLimit].join(' ');
    }

    renderMoneyState(): Node {
        const view = this;
        const {props, state} = view;

        if (!state.game.mapState) {
            return null;
        }

        const mapUserData = find(state.game.mapState.userList, {userId: user.getId()}) || null;

        if (mapUserData === null) {
            return null;
        }

        return ['Money:', mapUserData.money].join(' ');
    }

    showEndGame() {
        const view = this;
        const {props, state} = view;

        view.addDisableReason('end-game-popup');
    }

    render(): Node { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const queryData = queryString.parse(props.location.search);
        const {mapState} = state.game; // do not use game.getMapState(), map stay might undefined in game
        const mapActiveUserId = mapState && mapState.activeUserId || 'no-map-state';
        const isCanvasDisabled = state.activeUserId !== user.getId() || // your/not turn
            mapActiveUserId !== state.activeUserId || // map user id should be the same server active user id
            state.disabledByList.length > 0; // disabledByList should be empty array

        const isStoreOpen = queryData.viewId === 'store' && /^\d+$/.test(queryData.x) && /^\d+$/.test(queryData.y);

        return <Page>
            {isStoreOpen ?
                <Store
                    x={parseInt(queryData.x, 10)}
                    y={parseInt(queryData.y, 10)}
                    map={mapState}/> :
                null
            }


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
                    {hidden: isStoreOpen || isCanvasDisabled}
                )}
                onClick={async (): Promise<void> => {
                    await view.endTurn();
                }}>
                >|
            </div>

            {/* <div>{state.activeUserId === user.getId() ? 'YOUR' : 'NOT your'} turn</div>*/}

            {/*
                <div>mapActiveUserId === state(server).activeUserId :
                    {mapActiveUserId === state.activeUserId ? ' YES' : ' NO'}</div>
                */}

            {/* <div>{JSON.stringify(state.disabledByList)}</div> */}

            <canvas
                className={classnames({
                    hidden: isStoreOpen,
                    disabled: isCanvasDisabled
                })}
                key="canvas"
                ref="canvas"
                style={{
                    transition: 'opacity ease-out 0.3s',
                    width: props.system.screen.width,
                    height: props.system.screen.height - bottomBarData.height
                }}/>
            <BottomBar
                className={classnames('ta-l', {hidden: isStoreOpen})}>
                {view.renderSupplyState()}
                &nbsp;|&nbsp;
                {view.renderMoneyState()}
            </BottomBar>
        </Page>;
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
