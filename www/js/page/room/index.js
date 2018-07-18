// @flow

/* eslint consistent-this: ["error", "view"] */

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

import {user} from './../../module/user';
import {socket, type SocketMessageType} from './../../module/socket';
import Game from './../../components/game';
import type {AllRoomSettingsType, PushedStatePayloadType, ServerUserType} from './../../module/server-api';
import * as serverApi from './../../module/server-api';
import mapGuide from './../../maps/map-guide';
import {getCommanderDataByUserIndex, isOnLineRoomType} from './../../components/game/model/helper';
import type {BuildingType, MapType, MapUserType, UnitType} from './../../maps/type';

import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import Header from './../../components/ui/header';
import Form from './../../components/ui/form';
import FormHeader from './../../components/ui/form-header';
import Fieldset from './../../components/ui/fieldset';
import BottomBar from './../../components/ui/bottom-bar';
import Spinner from './../../components/ui/spinner';
import Locale from './../../components/locale';
import {getRoomState} from './../join-room/helper';
import type {ContextRouter} from 'react-router-dom';
import {localSocketIoClient} from './../../module/socket-local';
import type {GlobalStateType} from './../../app-reducer';
import type {LocaleType} from './../../components/locale/reducer';
import Scroll from './../../components/ui/scroll';
import style from './style.scss';
import {getMaxUserListSize} from '../join-room/helper';
import type {LangKeyType} from './../../components/locale/translation/type';
import {ButtonListWrapper} from '../../components/ui/button-list-wrapper';

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    isGameStart: boolean,
    isRoomDataFetching: boolean
|};

type PropsType = {|
    ...ContextRouter,
    locale: LocaleType
|};

class Room extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            userList: [],
            model: new MainModel(),
            isGameStart: false,
            isRoomDataFetching: true
        };
    }

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {match, history} = props;

        const roomId = match.params.roomId || '';

        if (roomId === '') {
            console.error('room id is not define!!!');
            return;
        }

        view.setState({isRoomDataFetching: true});

        const roomState = await getRoomState(roomId);

        view.setState({isRoomDataFetching: false});

        if (roomState === null || roomState.userList.length > roomState.maxUserSize) {
            console.error('roomState is null or room state is fool', roomState);
            history.goBack();
            return;
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
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {match} = props;
        const roomId = match.params.roomId || '';

        model.destroy();
        localSocketIoClient.removeAllListeners();

        // needed if game did not started
        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());
    }

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        if (isOnLineRoomType()) {
            model.listenTo(socket.attr.model, 'message', async (message: SocketMessageType): Promise<void> => {
                await view.onMessage(message);
            });
        } else {
            localSocketIoClient.on('message', async (message: SocketMessageType): Promise<void> => {
                await view.onMessage(message);
            });
        }
    }

    unbindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.stopListening();
        localSocketIoClient.removeAllListeners();
    }

    async onServerUserListChange(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {match} = props;
        const roomId = match.params.roomId || '';

        if (roomId === '') {
            console.error('room id is not define!!!');
            return Promise.resolve();
        }

        view.setState({isRoomDataFetching: true});

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

        view.setState({isRoomDataFetching: false});

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
                    console.log('---> The game has begun!!!');

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
        const {match} = props;
        const roomId = match.params.roomId || '';

        const userList: Array<ServerUserType> = state.userList
            .map((userItem: ServerUserType, userIndex: number): ServerUserType => ({
                socketId: userItem.socketId,
                userId: userItem.userId,
                teamId: mapGuide.teamIdList[userIndex],
                type: userItem.type
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

    renderUserList(): Array<Node> | null {
        const view = this;
        const {state} = view;
        const {userList} = state;

        if (userList.length === 0) {
            return null;
        }

        return userList
            .map((userData: ServerUserType, userIndex: number): Node => {
                return (
                    <div key={userData.userId}>
                        {userIndex === 0 ? <hr/> : null}
                        userId:
                        {' '}
                        {userData.userId}
                        <br/>
                        teamId:
                        {' '}
                        {userData.teamId}
                        <br/>
                        socketId:
                        {' '}
                        {userData.socketId}
                        <hr/>
                    </div>
                );
            });
    }

    renderForm(): Node {
        const view = this;
        const {props, state} = view;
        const {settings} = state;

        return (
            <Form>
                <Fieldset>
                    <FormHeader>
                        <Locale stringKey={('MAP': LangKeyType)}/>
                        :
                    </FormHeader>
                    {settings && settings.map.meta[props.locale.name].name}
                </Fieldset>

                <Fieldset>
                    <FormHeader>
                        <Locale stringKey={('PLAYERS': LangKeyType)}/>
                        :
                    </FormHeader>
                    {view.renderUserList()}
                </Fieldset>
            </Form>
        );
    }

    renderMasterButtonList(): Array<Node> {
        const view = this;
        const {props, state} = view;
        const {settings, userList} = state;
        const roomId = props.match.params.roomId || '';
        const maxPlayerListSize = settings ? getMaxUserListSize(settings.map) : 0;
        const isMapPlayerSizeExceed = userList.length >= maxPlayerListSize;

        const buttonList = [
            <Button
                key="start-button"
                onClick={async (): Promise<void> => {
                    view.setState({isRoomDataFetching: true});
                    await view.startGame();
                    view.setState({isRoomDataFetching: false});
                }}
            >
                <Locale stringKey={('START': LangKeyType)}/>
            </Button>
        ];

        if (isMapPlayerSizeExceed) {
            return buttonList;
        }

        buttonList.unshift(
            <Button
                key="add-bot-button"
                onClick={async (): Promise<void> => {
                    view.setState({isRoomDataFetching: true});
                    await serverApi.makeUser('bot', roomId);
                    view.setState({isRoomDataFetching: false});
                }}
            >
                <Locale stringKey={('ADD_BOT': LangKeyType)}/>
            </Button>
        );

        if (!isOnLineRoomType()) {
            buttonList.unshift(
                <Button
                    key="add-human-button"
                    onClick={async (): Promise<void> => {
                        view.setState({isRoomDataFetching: true});
                        await serverApi.makeUser('human', roomId);
                        view.setState({isRoomDataFetching: false});
                    }}
                >
                    <Locale stringKey={('ADD_HUMAN': LangKeyType)}/>
                </Button>
            );
        }

        return buttonList;
    }

    render(): Node { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const {settings, userList, isGameStart, isRoomDataFetching} = state;
        const roomId = props.match.params.roomId || '';
        const myPlayerIndex = userList
            .map((userData: ServerUserType): string => userData.userId)
            .indexOf(user.getId());

        if (isGameStart === true) {
            return <Game roomId={roomId}/>;
        }

        return (
            <Page>
                <Spinner isOpen={isRoomDataFetching}/>
                <Header>
                    {settings ?
                        ['(', userList.length, '/', getMaxUserListSize(settings.map), ') '].join('') +
                        settings.map.meta[props.locale.name].name :
                        '\u00A0'
                    }
                </Header>
                <Scroll>
                    {view.renderForm()}
                </Scroll>

                {myPlayerIndex === 0 ?
                    <ButtonListWrapper className={style.button_list_wrapper}>
                        {view.renderMasterButtonList()}
                    </ButtonListWrapper> :
                    <BottomBar>
                        <Locale stringKey={('WAIT_FOR_START': LangKeyType)}/>
                    </BottomBar>}
            </Page>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        locale: state.locale
    }),
    {}
)(Room);
