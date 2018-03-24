// @flow

// wait other players and prepare map\settings for Game view

// list of settings, can NOT be changed, this is start game state
// - defaultMoney
// - map
// - unitLimit
// - userList

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
import type {BuildingType, MapType, UnitType} from '../../maps/type';

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

                if (message.states.last.state.isGameStart === true && state.isGameStart !== true) {
                    console.warn('---> The game has begun!!!');

                    const settings = await serverApi.getAllRoomSettings(roomId);

                    view.setState({
                        settings: settings.settings
                    });

                    view.setState({isGameStart: true});

                    return;
                }

                break;

            default:
                console.log('---> view - room - unsupported message type: ' + message.type);
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
                const userList: Array<ServerUserType> = state.userList
                    .map((userItem: ServerUserType, userIndex: number): ServerUserType => {
                        return {
                            socketId: userItem.socketId,
                            userId: userItem.userId,
                            teamId: mapGuide.teamIdList[userIndex]
                        };
                    });


                const takeTurnResult = await serverApi.takeTurn(roomId, user.getId());

                const map: MapType | void = state.settings && state.settings.map;

                if (!map) {
                    console.error('---> map is not exists!!!!');
                    return;
                }

                [].concat(map.buildings, map.units).forEach((userItem: BuildingType | UnitType) => { // eslint-disable-line complexity
                    const userItemUserId = typeof userItem.userId === 'string' ? userItem.userId : '';

                    if (typeof userItem.id !== 'string' || userItem.id === '') {
                        Object.assign(userItem, {id: [userItem.x, userItem.y, Math.random()].join('_')});
                    }

                    if (userItemUserId === '') {
                        return;
                    }

                    const userIndex = parseInt(userItemUserId.replace(/\D/g, ''), 10) || 0;

                    const userData: ServerUserType | void = userList[userIndex];

                    if (!userData) {
                        Reflect.deleteProperty(userItem, 'userId');
                        return;
                    }

                    Object.assign(userItem, {userId: userData.userId});
                });

                const setSettingResult = await serverApi.setRoomSetting(roomId, {
                    userList
                });

                const setSettingResult1 = await serverApi.setRoomSetting(roomId, {
                    map
                });


                const newState: PushedStatePayloadType = {
                    isGameStart: true,
                    activeUserId: user.getId(),
                    map
                };

                const pushStateResult = await serverApi.pushState(roomId, user.getId(), {
                    type: 'room__push-state',
                    state: newState
                });
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
