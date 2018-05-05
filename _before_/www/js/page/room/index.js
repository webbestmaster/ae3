// @flow

// wait other players and prepare map\settings for Game view

// list of settings, can NOT be changed, this is start game state
// - defaultMoney
// - map
// - unitLimit
// - userList

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import MainModel from './../../lib/main-model/index';
import ReactJson from 'react-json-view';

import {user} from './../../module/user';
import {socket, type SocketMessageType} from './../../module/socket';
import Game from './../../components/game';
import type {AllRoomSettingsType, PushedStatePayloadType, ServerUserType} from './../../module/server-api';
// import uiStyle from './../../components/ui/ui.scss';
// import serviceStyle from './../../../css/service.scss';
// import type {AuthType} from './../../components/auth/reducer';
import * as serverApi from './../../module/server-api';
import mapGuide from './../../maps/map-guide';
import {getCommanderDataByUserIndex} from './../../components/game/model/helper';

import {type MatchType} from './../../app/routes';
import type {BuildingType, MapType, MapUserType, UnitType} from './../../maps/type';

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
            console.error('room id is not define!!!');
            return '';
        }

        // try to join into room, in case disconnected, nah
        // const socketInitialPromiseResult = await socket.attr.initialPromise;
        // const joinResult = await serverApi.joinRoom(roomId, user.getId(), socket.getId());

        // const settingsResponse = await serverApi.getAllRoomSettings(roomId);
        // const usersResponse = await serverApi.getAllRoomUsers(roomId);

        // view.setState({
        // settings: settingsResponse.settings,
        // userList: usersResponse.users,
        // model: new MainModel()
        // });

        view.bindEventListeners();

        await view.onServerUserListChange();

        return roomId;
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const roomId = props.match.params.roomId || '';

        model.destroy();

        // const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());
    }

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.listenTo(socket.attr.model, 'message', async (message: SocketMessageType): Promise<void> => {
            await view.onMessage(message);
        });
    }

    unbindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.stopListening();
    }

    async onServerUserListChange(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const roomId = props.match.params.roomId || '';

        if (roomId === '') {
            console.error('room id is not define!!!');
            return Promise.resolve();
        }

        const roomDataSettings = await serverApi.getAllRoomSettings(roomId);
        const defaultMoney = roomDataSettings.settings.map.defaultMoney;
        const roomDataUsers = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            userList: roomDataUsers.users
        });

        roomDataSettings.settings.map.userList = roomDataUsers
            .users.map((serverUser: ServerUserType, userIndex: number): MapUserType => {
                return {
                    userId: serverUser.userId,
                    money: defaultMoney,
                    teamId: mapGuide.teamIdList[userIndex],
                    commander: {
                        type: getCommanderDataByUserIndex(userIndex),
                        buyCount: 0
                    }
                };
            });

        roomDataSettings.settings.map.activeUserId = roomDataSettings.settings.map.userList[0].userId;

        await serverApi.setRoomSetting(roomId, {map: roomDataSettings.settings.map});

        view.setState({
            settings: roomDataSettings.settings
        });

        return Promise.resolve();
    }

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity, max-statements
        const view = this;
        const {props, state} = view;
        // const {model} = state;
        // const roomId = props.match.params.roomId || '';

        /*
        if (!state.settings) {
            console.error('state.settings is not defined');
            return Promise.resolve();
        }
        */

        if (state.isGameStart === true) {
            console.error('unbindEventListeners should prevent this IF');
            return Promise.resolve();
        }

        switch (message.type) {
            case 'room__take-turn':
                break;

            case 'room__drop-turn':
                break;

            case 'room__join-into-room':
            case 'room__leave-from-room':
            case 'room__user-disconnected':
                await view.onServerUserListChange();
                break;

            case 'room__push-state':
                if (message.states.last.state.isGameStart === true) {
                    console.warn('---> The game has begun!!!');

                    view.unbindEventListeners();

                    view.setState({
                        isGameStart: true,
                        settings: null, // wipe extra data
                        userList: [] // wipe extra data
                    });

                    return Promise.resolve();
                }

                break;

            default:
                console.error('---> view - room - unsupported message type: ' + message.type);
        }

        return Promise.resolve();
    }

    async startGame(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const roomId = props.match.params.roomId || '';

        const userList: Array<ServerUserType> = state.userList
            .map((userItem: ServerUserType, userIndex: number): ServerUserType => ({
                socketId: userItem.socketId,
                userId: userItem.userId,
                teamId: mapGuide.teamIdList[userIndex]
            }));

        const takeTurnResult = await serverApi.takeTurn(roomId, user.getId());

        const map: MapType | void = state.settings && state.settings.map;

        if (!map) {
            console.error('---> map is not exists!!!!');
            return;
        }

        [].concat(map.buildings, map.units).forEach((userItem: BuildingType | UnitType) => { // eslint-disable-line complexity
            const userItemUserId = typeof userItem.userId === 'string' ? userItem.userId : null;

            if (typeof userItem.id !== 'string' || userItem.id === '') {
                userItem.id = [userItem.x, userItem.y, Math.random()].join('_'); // eslint-disable-line no-param-reassign
            }

            if (userItemUserId === null) {
                return;
            }

            const userIndex = parseInt(userItemUserId.replace(/\D/g, ''), 10) || 0;

            const userData: ServerUserType | void = userList[userIndex];

            if (!userData) {
                Reflect.deleteProperty(userItem, 'userId');
                return;
            }

            userItem.userId = userData.userId; // eslint-disable-line no-param-reassign
        });

        /*
        const setSettingResult = await serverApi.setRoomSetting(roomId, {
            userList
        });
        */

        const setSettingResult = await serverApi.setRoomSetting(roomId, {
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

            <ReactJson src={state && state.userList && state.userList}/>
            <br/>
            <br/>

            {/* <ReactJson src={state && state.settings && state.settings}/> */}

            <div className="json">
                {JSON.stringify(state && state.settings && state.settings)}
            </div>

            <br/>
            <br/>

            <button onClick={async (): Promise<void> => {
                await view.startGame();
            }}>
                -------------<br/>
                --- start ---<br/>
                -------------
            </button>
            <br/>
            <br/>

        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Room);