// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import routes from './../../app/routes';
import type {HistoryType, MatchType} from './../../app/routes';
import type {AllRoomSettingsType, ServerUserType, GetAllRoomIdsType} from './../../module/server-api';

import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './../../components/auth/reducer';

type StateType = {|
    roomIds: Array<string>
    // settings: AllRoomSettingsType,
    // userList: Array<ServerUserType>
|};

type PropsType = {|
    auth: AuthType,
    history: HistoryType
|};

class JoinRoom extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();
        const view = this;

        const state: StateType = {
            roomIds: []
        };

        view.state = state;
    }

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state} = view;

        const allRoomIds = await serverApi.getAllRoomIds();

        view.setState({roomIds: allRoomIds.roomIds});
    }

    async joinRoom(roomId: string): Promise<void> {
        const view = this;
        const {props, state} = view;
        const socketId = props.auth.socket.id;
        const userId = props.auth.user.id;

        const joinRoomResult = await serverApi.joinRoom(roomId, userId, socketId);

        if (joinRoomResult.roomId === '') {
            return;
        }

        props.history.push(routes.room.replace(':roomId', joinRoomResult.roomId));
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>JoinRoom</h1>
            <br/>

            {state.roomIds.map((roomId: string): Node => <div
                onClick={async (): Promise<void> => {
                    const result = view.joinRoom(roomId);
                }}
                key={roomId}>
                {roomId}
            </div>)}

            <br/>
            <br/>
        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {}
)(JoinRoom);
