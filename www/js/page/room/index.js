// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import MainModel from './../../lib/main-model/index';

import {Link} from 'react-router-dom';

import {user} from './../../module/user';
import {socket, type SocketMessageType} from './../../module/socket';
import Game from './../../components/game';

// import uiStyle from './../../components/ui/ui.scss';
// import serviceStyle from './../../../css/service.scss';
// import type {AuthType} from '../../components/auth/reducer';
import * as serverApi from './../../module/server-api';
import type {PushedStatePayloadType} from './../../module/server-api';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import mapGuide from './../../maps/map-guide';

import routes, {type HistoryType, type MatchType} from './../../app/routes';
import type {MapType} from '../../maps/type';

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    isGameStart: boolean
|};

type PropsType = {|
    match: MatchType
|};

class Room extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        const state: StateType = {
            userList: [],
            model: new MainModel(),
            isGameStart: false
        };

        view.state = state;
    }

    async componentDidMount(): Promise<string> {
        const view = this;
        const {props, state} = view;

        const roomId = props.match.params.roomId || '';

        if (roomId === '') {
            return '';
        }

        // try to join into room, in case disconnected
        const socketInitialPromiseResult = await socket.attr.initialPromise;
        const joinResult = await serverApi.joinRoom(roomId, user.getId(), socket.getId());

        const settings = await serverApi.getAllRoomSettings(roomId);
        const users = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            settings: settings.settings,
            userList: users.users,
            model: new MainModel()
        });

        view.bindEventListeners();

        return roomId;
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const roomId = props.match.params.roomId || '';

        model.destroy();

        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());

        console.log(leaveRoomResult);
    }

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.listenTo(socket.attr.model, 'message', async (message: SocketMessageType): Promise<void> => {
            await view.onMessage(message);
        });
    }

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const roomId = props.match.params.roomId || '';
        let users = null;

        switch (message.type) {
            case 'room__take-turn':
                console.log('room__take-turn', message);
                break;

            case 'room__join-into-room':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__leave-from-room':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__user-disconnected':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__push-state':

                console.log('push - state');

                if (message.states.last.state.isGameStart === true && state.isGameStart !== true) {
                    console.warn('The game has begun!!!');

                    const settings = await serverApi.getAllRoomSettings(roomId);

                    console.log(settings);

                    view.setState({
                        settings: settings.settings
                    });

                    view.setState({isGameStart: true});

                    return;
                }

                console.log(message);

                break;

            default:
                console.log('unsupported message type: ' + message.type);
        }
    }

    render(): Node { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const roomId = props.match.params.roomId || '';

        if (state.isGameStart === true) {
            return <Game roomId={roomId}/>;
        }

        return <div>
            <h1>Room</h1>
            <h2>wait for other players</h2>

            <div className="json">
                {state && state.userList && JSON.stringify(state.userList)}
            </div>

            <br/>

            <div className="json">
                {state && state.settings && JSON.stringify(state.settings)}
            </div>

            <button onClick={async (): Promise<void> => {
                const setSettingResult = await serverApi.setRoomSetting(roomId, {
                    userList: state.userList.map((userItem: ServerUserType, userIndex: number): ServerUserType => {
                        return {
                            socketId: userItem.socketId,
                            userId: userItem.userId,
                            teamId: mapGuide.teamIdList[userIndex]
                        };
                    })
                });

                const takeTurnResult = await serverApi.takeTurn(roomId, user.getId());

                console.log(takeTurnResult);

                const map: MapType | void = state.settings && state.settings.map;

                if (!map) {
                    return;
                }

                const newState: PushedStatePayloadType = {
                    isGameStart: true,
                    activeUserId: user.getId(),
                    map
                };

                const pushStateResult = await serverApi.pushState(roomId, user.getId(), {
                    type: 'room__push-state',
                    state: newState
                });

                console.log(pushStateResult);
            }}>
                start
            </button>

        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Room);
