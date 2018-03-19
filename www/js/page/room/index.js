// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import type {AuthType} from '../../components/auth/reducer';
import * as serverApi from './../../module/server-api';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';

import routes, {type HistoryType, type MatchType} from './../../app/routes';

type StateType = {|
    settings: AllRoomSettingsType,
    userList: Array<ServerUserType>
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

        const settings = await serverApi.getAllRoomSettings(roomId);
        const users = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            settings: settings.settings,
            userList: users.users
        });

        return roomId;
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>Room</h1>
            <h2>wait for other players</h2>

            <div className="json">
                {JSON.stringify(state)}
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
