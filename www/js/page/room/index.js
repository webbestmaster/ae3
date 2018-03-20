// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import MainModel from './../../lib/main-model';

import {Link} from 'react-router-dom';

import {user} from './../../module/user';
import {socket, type SocketMessageType} from './../../module/socket';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import type {AuthType} from '../../components/auth/reducer';
import * as serverApi from './../../module/server-api';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';

import routes, {type HistoryType, type MatchType} from './../../app/routes';

type StateType = {|
    settings: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel
|};

type PropsType = {|
    match: MatchType
|};

class Room extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

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
            const result = await view.onMessage(message);
        });
    }

    async onMessage(message: SocketMessageType): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const roomId = props.match.params.roomId || '';
        let users = null;

        switch (message.type) {
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

            default:
                console.log('unsupported message type: ' + message.type);
        }
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

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

        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Room);
