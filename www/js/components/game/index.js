// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from '../../index';
import type {SystemType} from '../system/reducer';
import Game from './model/index';
import type {SocketMessageType} from '../../module/socket';
import * as serverApi from '../../module/server-api';
import MainModel from '../../lib/main-model';
import type {AllRoomSettingsType, ServerUserType} from '../../module/server-api';
import ReactJson from 'react-json-view';
import find from 'lodash/find';
import Unit from './model/unit';
import type {MapUserType} from './../../maps/type';

type PropsType = {|
    system: SystemType,
    roomId: string
|};

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    mapUserList: Array<MapUserType>,
    model: MainModel,
    game: Game,
    activeUserId: string,
    mapActiveUserId: string,
    socketMessageList: Array<SocketMessageType>
|};

type RefsType = {|
    canvas: HTMLElement
|};

class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor() {
        super();

        const view = this;

        view.state = {
            userList: [],
            mapUserList: [],
            model: new MainModel(),
            game: new Game(),
            activeUserId: '',
            mapActiveUserId: '',
            socketMessageList: []
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
            activeUserId: settings.map.activeUserId,
            mapActiveUserId: settings.map.activeUserId,
            mapUserList: settings.map.userList
        });

        // initialize game's data
        state.game.setSettings(settings);
        state.game.setUserList(users);
        state.game.setRoomId(props.roomId);

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
                view.setState({mapActiveUserId: 'no-user-id'});

                break;

            case 'room__join-into-room':
                allUserResponse = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: allUserResponse.users
                });

                break;

            case 'room__leave-from-room':
                allUserResponse = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: allUserResponse.users
                });

                break;

            case 'room__user-disconnected':
                allUserResponse = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: allUserResponse.users
                });

                break;

            case 'room__push-state':

                view.setState({activeUserId: message.states.last.state.activeUserId});
                view.setState({mapActiveUserId: message.states.last.state.map.activeUserId});
                view.setState({mapUserList: message.states.last.state.map.userList});

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

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>game</h1>

            <h2>server activeUserId:<br/>{state.activeUserId}</h2>
            <h3>mapActiveUser: {state.game &&
            state.game.mapState &&
            state.game.mapState.activeUserId || 'no map activeUserId'}</h3>

            <h2>server user list:</h2>

            <ReactJson src={state.userList}/>

            <h2>map user list:</h2>

            <ReactJson src={state.mapUserList}/>


            <button onClick={async (): Promise<void> => {
                await view.endTurn();
            }}>
                end turn
            </button>

            <canvas style={{
                display: 'none',
                width: props.system.screen.width,
                height: props.system.screen.height
            }} ref="canvas"/>

        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        system: state.system
    }),
    {
        // setUser
    }
)(GameView);
