// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {HistoryType} from './../../app/routes';
import routes from './../../app/routes';
import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './../../components/auth/reducer';

import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';
import Form from './../../components/ui/form';
import Label from './../../components/ui/label';
import FormHeader from './../../components/ui/form-header';
import Fieldset from './../../components/ui/fieldset';

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

        return <Page>
            <Header>Join Into Room</Header>

            <Form>
                <Fieldset>
                    {state.roomIds.length === 0 ?
                        'No Open Rooms, create your own room...' :
                        state.roomIds.map((roomId: string): Node => <p
                            style={{
                                padding: 10,
                                cursor: 'pointer'
                            }}
                            onClick={async (): Promise<void> => {
                                const result = view.joinRoom(roomId);
                            }}
                            key={roomId}>
                            {roomId}
                        </p>)
                    }
                </Fieldset>
            </Form>
        </Page>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {}
)(JoinRoom);
