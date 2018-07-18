// @flow

/* global window */

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
import {Button} from '../../components/ui/button';
import type {LocaleType} from './../../components/locale/reducer';
import style from './style.scss';
import Scroll from './../../components/ui/scroll';
import classnames from 'classnames';
import Spinner from './../../components/ui/spinner';

type StateType = {|
    // roomIds: Array<string>,
    roomDataList: Array<RoomDataType> | null,
    isRoomsFetching: boolean
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
            roomDataList: null,
            isRoomsFetching: false
        };
    }

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state} = view;

        view.setState({isRoomsFetching: true});

        const getAllRoomIdsResult = await serverApi.getAllRoomIds();
        const roomDataList = [];

        for (let ii = 0; ii < getAllRoomIdsResult.roomIds.length; ii += 1) {
            roomDataList.push(await getRoomState(getAllRoomIdsResult.roomIds[ii]));
        }

        view.setState({
            roomDataList,
            isRoomsFetching: false
        });
    }

    async joinRoom(roomId: string): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {auth, history} = props;
        const socketId = auth.socket.id;
        const userId = auth.user.id;

        view.setState({isRoomsFetching: true});

        const roomState = await getRoomState(roomId);

        if (roomState === null || roomState.userList.length === roomState.maxUserSize) {
            console.error('roomState is null or room state is fool', roomState);
            view.setState({isRoomsFetching: false});
            await view.componentDidMount();
            return;
        }

        const joinRoomResult = await serverApi.joinRoom(roomId, userId, socketId);

        view.setState({isRoomsFetching: false});

        if (joinRoomResult.roomId === '') {
            console.error('Did not join into room with id', roomId);
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
        const {roomDataList, isRoomsFetching} = state;

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
                        <Button
                            onClick={() => {
                                view.setState(
                                    {roomDataList: null},
                                    () => {
                                        // I added setTimeout cause room list updates too fast
                                        window.setTimeout(() => {
                                            view.componentDidMount().then(() => {
                                                console.log('room updated');
                                            });
                                        }, 1e3);
                                    }
                                );
                            }}
                        >
                            <Locale stringKey={('REFRESH': LangKeyType)}/>
                        </Button>
                    </ButtonListWrapper>
                </Page>
            );
        }

        const pageClassName = isRoomsFetching ? serviceStyle.disabled : '';

        return (
            <Page className={pageClassName}>
                {JoinRoom.renderHeader()}
                <Spinner isOpen={isRoomsFetching}/>
                <Scroll>
                    {roomDataList
                        .map((roomData: RoomDataType): Node => {
                            return (
                                <Button
                                    onClick={async (): Promise<void> => {
                                        const result = await view.joinRoom(roomData.roomId);
                                    }}
                                    className={style.open_room_item}
                                    key={roomData.roomId}
                                >
                                    <div className={style.right_arrow}>
                                        &gt;&gt;
                                    </div>
                                    <p className={classnames(serviceStyle.ellipsis, serviceStyle.ta_l)}>
                                        {'['}
                                        {roomData.userList.length}
                                        {'/'}
                                        {roomData.maxUserSize}
                                        {'] '}
                                        {roomData.settings.map.meta[props.locale.name].name}
                                    </p>
                                </Button>
                            );
                        })}
                </Scroll>
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
