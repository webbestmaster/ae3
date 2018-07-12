// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
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
import type {ContextRouter} from 'react-router-dom';
import {isOnLineRoomType} from '../../components/game/model/helper';
import serviceStyle from './../../../css/service.scss';
import type {LangKeyType} from '../../components/locale/translation/type';
import Locale from './../../components/locale';
import {ButtonListWrapper} from '../../components/ui/button-list-wrapper';
import buttonListWrapperStyle from '../../components/ui/button-list-wrapper/style.scss';
import {ButtonLink} from '../../components/ui/button-link';
import type {LocaleType} from './../../components/locale/reducer';

type StateType = {|
    // roomIds: Array<string>,
    roomDataList: Array<RoomDataType> | null
    // settings: AllRoomSettingsType,
    // userList: Array<ServerUserType>
|};

type PropsType = {|
    ...ContextRouter,
    auth: AuthType,
    locale: LocaleType
|};

class JoinRoom extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            roomDataList: null
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

        if (isOnLineRoomType()) {
            history.push(routes.roomOnLine.replace(':roomId', joinRoomResult.roomId));
        } else {
            history.push(routes.roomOffLine.replace(':roomId', joinRoomResult.roomId));
        }
    }

    static renderHeader(): Node {
        return (
            <Header>
                <Locale stringKey={('JOIN_GAME': LangKeyType)}/>
            </Header>
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;
        const {roomDataList} = state;

        if (roomDataList === null) {
            return (
                <Page>
                    {JoinRoom.renderHeader()}
                    <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                        <Fieldset className={serviceStyle.ta_c}>
                            <span className={serviceStyle.zero_opacity}>
                                ...
                            </span>
                            <Locale stringKey={('LOADING': LangKeyType)}/>
                            ...
                        </Fieldset>
                    </ButtonListWrapper>
                </Page>
            );
        }

        if (roomDataList.length === 0) {
            return (
                <Page>
                    {JoinRoom.renderHeader()}
                    <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                        <Fieldset className={serviceStyle.ta_c}>
                            <Locale stringKey={('MESSAGE__NO_OPEN_GAME': LangKeyType)}/>
                        </Fieldset>
                        <ButtonLink to={routes.createRoomOnline}>
                            <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                        </ButtonLink>
                    </ButtonListWrapper>
                </Page>
            );
        }

        return (
            <Page>
                {JoinRoom.renderHeader()}
                <div className={serviceStyle.grow_1}>
                    {roomDataList
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
                                    {roomData.settings.map.meta[props.locale.name].name}
                                    {' - '}
                                    {roomData.userList.length}
                                    {' '}
                                    /
                                    {' '}
                                    {roomData.maxUserSize}
                                </p>
                            );
                        })}
                </div>
            </Page>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth,
        locale: state.locale
    }),
    {}
)(JoinRoom);
