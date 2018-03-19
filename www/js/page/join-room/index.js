// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import routes from '../../app/routes';
import type {MatchType} from '../../app/routes';
import type {AllRoomSettingsType, ServerUserType, GetAllRoomIdsType} from '../../module/server-api';

import * as serverApi from './../../module/server-api';

type StateType = {|
    roomIds: Array<string>
    // settings: AllRoomSettingsType,
    // userList: Array<ServerUserType>
|};

type PropsType = {|
    // match: MatchType
|};

class JoinRoom extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state} = view;

        const allRoomIds = await serverApi.getAllRoomIds();

        view.setState({roomIds: allRoomIds.roomIds});
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>JoinRoom</h1>
            <br/>
            <div className="json">
                {JSON.stringify(state)}
            </div>
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
)(JoinRoom);
