// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from './../../index';
import type {SystemType} from './../system/reducer';
import Game from './model/index';
import type {SocketMessageType} from './../../module/socket';
import * as serverApi from './../../module/server-api';
import MainModel from './../../lib/main-model';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import ReactJson from 'react-json-view';
import find from 'lodash/find';
import Unit from './model/unit';
import type {MapUserType} from './../../maps/type';
import {Link, withRouter, Switch, Route} from 'react-router-dom';
import type {ContextRouter} from 'react-router-dom';
import Store from './../store';
import queryString from 'query-string';
import type {MapType, LandscapeType, BuildingType, GraveType} from './../../maps/type';
import type {UnitTypeType} from './model/unit/unit-guide';
import unitData from './model/unit/unit-guide';

type PropsType = {|
    system: SystemType,
    roomId: string,
    ...ContextRouter
|};

export type DisabledByItemType = 'server-receive-message';

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

        await serverApi.dropTurn(props.roomId, user.getId());
    }

    addDisableReason(reason: DisabledByItemType) {
        const view = this;
        const {props, state} = view;

        view.setState((prevState: StateType): StateType => {
            prevState.disabledByList.push(reason);
            return prevState;
        });
    }

    removeDisableReason(reason: DisabledByItemType) {
        const view = this;
        const {props, state} = view;

        view.setState((prevState: StateType): StateType => {
            const {disabledByList} = prevState;
            const reasonIndex = disabledByList.indexOf(reason);

            if (reasonIndex === -1) {
                console.error('ERROR: reason is not exists in disabledByList', reason, view);
                return prevState;
            }

            disabledByList.splice(reasonIndex);
            return prevState;
        });
    }

    render(): Node { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const queryData = queryString.parse(props.location.search);
        const mapActiveUserId = state.game.mapState &&
            state.game.mapState.activeUserId || 'no map activeUserId';

        return <div>

            <div className="json">{JSON.stringify(props.match)}</div>

            <div>
                {queryData.viewId === 'store' &&
                /^\d+$/.test(queryData.x) &&
                /^\d+$/.test(queryData.y) ?
                    <Store
                        x={parseInt(queryData.x, 10)}
                        y={parseInt(queryData.y, 10)}
                        map={state.game.mapState}/> :
                    <div>NO store, for {JSON.stringify(queryData)}</div>}
            </div>

            <h1>game</h1>

            <h2>server activeUserId: {state.activeUserId}</h2>
            <h3>mapActiveUser: {mapActiveUserId}</h3>

            <h2>server user list:</h2>

            <ReactJson src={state.userList}/>

            <h2>map user list:</h2>

            {state.game.mapState ? <ReactJson src={state.game.mapState.userList}/> : <h1>no map</h1>}

            <button onClick={async (): Promise<void> => {
                await view.endTurn();
            }}>
                end turn
            </button>

            <div>{state.activeUserId === user.getId() ? 'YOUR' : 'NOT your'} turn</div>
            <div>mapActiveUserId === state(server).activeUserId :
                {mapActiveUserId === state.activeUserId ? ' YES' : ' NO'}</div>

            <div>{JSON.stringify(state.disabledByList)}</div>

            <canvas
                key="canvas"
                ref="canvas"
                style={{
                    width: props.system.screen.width,
                    height: props.system.screen.height
                }}/>

        </div>;
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
