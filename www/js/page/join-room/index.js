// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {HistoryType} from './../../app/routes';
import routes from './../../app/routes';
import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './../../components/auth/reducer';
import Page from './../../components/ui/page';
import Header from './../../components/ui/header';
import Form from './../../components/ui/form';
import Fieldset from './../../components/ui/fieldset';
import type {RoomDataType} from './helper';
import {getRoomState} from './helper';

type StateType = {|
    // roomIds: Array<string>,
    roomDataList: Array<RoomDataType>
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

        view.state = {
            roomDataList: []
        };
    }

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state} = view;

        const getAllRoomIdsResult = await serverApi.getAllRoomIds();
        const roomDataList = [];

        for (let ii = 0; ii < getAllRoomIdsResult.roomIds.length; ii += 1) {
            roomDataList.push(await getRoomState(getAllRoomIdsResult.roomIds[ii]));
        }

        view.setState({roomDataList});
    }

    async joinRoom(roomId: string): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {auth, history} = props;
        const socketId = auth.socket.id;
        const userId = auth.user.id;

        const roomState = await getRoomState(roomId);

        if (roomState === null || roomState.userList.length === roomState.maxUserSize) {
            console.error('roomState is null or room state is fool', roomState);
            await view.componentDidMount();
            return;
        }

        const joinRoomResult = await serverApi.joinRoom(roomId, userId, socketId);

        if (joinRoomResult.roomId === '') {
            return;
        }

        history.push(routes.room.replace(':roomId', joinRoomResult.roomId));
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        if (state.roomDataList.length === 0) {
            return (
                <Page>
                    <Header>
                        Join Into Room
                    </Header>
                    <Form>
                        <Fieldset>
                            No Open Rooms, create your own room...
                        </Fieldset>
                    </Form>
                </Page>
            );
        }

        return (
            <Page>
                <Header>
                    Join Into Room
                </Header>

                <Form>
                    <Fieldset>
                        {state.roomDataList
                            .map((roomData: RoomDataType): Node => {
                                return (
                                    <p
                                        style={{
                                            padding: 10,
                                            cursor: 'pointer'
                                        }}
                                        onClick={async (): Promise<void> => {
                                            const result = view.joinRoom(roomData.roomId);
                                        }}
                                        key={roomData.roomId}
                                    >
                                        {roomData.roomId}
                                        {' - '}
                                        {roomData.settings.map.meta.en.name}
                                        {' - '}
                                        {roomData.userList.length}
                                        {' '}
                                        /
                                        {' '}
                                        {roomData.maxUserSize}
                                    </p>
                                );
                            })}
                    </Fieldset>
                </Form>
            </Page>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {}
)(JoinRoom);
