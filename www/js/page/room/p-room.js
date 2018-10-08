// @flow

/* global window */

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
import MainModel from 'main-model';
import classnames from 'classnames';
import {user} from '../../module/user';
import {socket, type SocketMessageType} from '../../module/socket';
import Game from '../../component/game/c-game';
import type {AllRoomSettingsType, PushedStatePayloadType, ServerUserType} from '../../module/server-api';
import * as serverApi from '../../module/server-api';
import mapGuide from '../../maps/map-guide';
import {getCommanderDataByUserIndex, getMapSize, isOnLineRoomType} from '../../component/game/model/helper';
import type {BuildingType, MapType, MapUserType, UnitType} from '../../maps/type';

import Page from '../../component/ui/page/c-page';
import Button from '../../component/ui/button/c-button';
import Header from '../../component/ui/header/c-header';
import Form from '../../component/ui/form/c-form';
import FormHeader from '../../component/ui/form-header/c-form-header';
import Fieldset from '../../component/ui/fieldset/c-fieldset';
import BottomBar from '../../component/ui/bottom-bar/c-bottom-bar';
import Spinner from '../../component/ui/spinner/c-spinner';
import MapPreview from '../../component/ui/map-preview/c-map-preview';
import Locale from '../../component/locale/c-locale';
import {getMaxUserListSize, getRoomState} from '../join-room/helper';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import {localSocketIoClient} from '../../module/socket-local';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import type {LocaleType} from '../../component/locale/reducer';
import Scroll from '../../component/ui/scroll/c-scroll';
import style from './style.scss';
import serviceStyle from '../../../css/service.scss';
import createRoomStyle from '../create-room/style.scss';
import type {LangKeyType} from '../../component/locale/translation/type';
import ButtonListWrapper from '../../component/ui/button-list-wrapper/c-button-list-wrapper';
import {isNotString, isString} from '../../lib/is/is';

const roomPushState = 'room__push-state';

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    isGameStart: boolean,
    isRoomDataFetching: boolean
|};

type PropsType = {|
    ...$Exact<ContextRouterType>,
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

        await view.showSpinner();

        const roomState = await getRoomState(roomId);

        await view.hideSpinner();

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

        await serverApi.takeTurn(roomId, user.getId());
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {match} = props;
        const roomId = match.params.roomId || '';

        view.unbindEventListeners();

        model.destroy();
        localSocketIoClient.removeAllListeners();

        // needed if game did not started
        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());
    }

    bindEventListeners() {
        const view = this;
        const {props, state, attr} = view;
        const {model} = state;
        const {match, history} = props;
        const roomId = match.params.roomId || '';

        if (isOnLineRoomType()) {
            model.listenTo(
                socket.attr.model,
                'message',
                async (message?: SocketMessageType): Promise<void> => {
                    if (!message) {
                        console.error('SocketMessage is not define');
                        return;
                    }
                    await view.onMessage(message);
                }
            );
        } else {
            localSocketIoClient.on(
                'message',
                async (message: SocketMessageType): Promise<void> => {
                    await view.onMessage(message);
                }
            );
        }
    }

    unbindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.stopListening();
        localSocketIoClient.removeAllListeners();
    }

    getMyPlayerIndex(): number {
        const view = this;
        const {state} = view;
        const {userList} = state;

        return userList.map((userData: ServerUserType): string => userData.userId).indexOf(user.getId());
    }

    async showSpinner(): Promise<void> {
        const view = this;

        return new Promise((resolve: () => void) => {
            view.setState({isRoomDataFetching: true}, resolve);
        });
    }

    async hideSpinner(): Promise<void> {
        const view = this;

        return new Promise((resolve: () => void) => {
            view.setState({isRoomDataFetching: false}, resolve);
        });
    }

    async removeUser(userId: string): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {match} = props;
        const {settings} = state;
        const roomId = match.params.roomId || '';

        if (!settings) {
            return;
        }

        await serverApi.pushState(roomId, user.getId(), {
            type: roomPushState,
            state: {
                type: 'remove-user',
                map: settings.map,
                userId
            }
        });

        // needed to kick bot and force to kick user
        await serverApi.leaveRoom(roomId, userId);
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

        await view.showSpinner();

        const roomDataSettings = await serverApi.getAllRoomSettings(roomId);
        const defaultMoney = roomDataSettings.settings.map.defaultMoney;
        const roomDataUsers = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            userList: roomDataUsers.users
        });

        roomDataSettings.settings.map.userList = roomDataUsers.users.map(
            (serverUser: ServerUserType, userIndex: number): MapUserType => {
                return {
                    userId: serverUser.userId,
                    money: defaultMoney,
                    teamId: mapGuide.teamIdList[userIndex],
                    commander: {
                        type: getCommanderDataByUserIndex(userIndex),
                        buyCount: 0
                    }
                };
            }
        );

        roomDataSettings.settings.map.activeUserId = roomDataSettings.settings.map.userList[0].userId;

        await serverApi.setRoomSetting(roomId, {map: roomDataSettings.settings.map});

        view.setState({
            settings: roomDataSettings.settings
        });

        await view.hideSpinner();

        return Promise.resolve();
    }

    // eslint-disable-next-line complexity, max-statements
    async onMessage(message: SocketMessageType): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {match, history} = props;
        const roomId = match.params.roomId || '';

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

        const lastState = message.type === roomPushState ? message.states.last.state : null;

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

            case roomPushState:
                // kicked from room
                if (lastState !== null && lastState.type === 'remove-user' && lastState.userId === user.getId()) {
                    view.unbindEventListeners();
                    await serverApi.leaveRoom(roomId, user.getId());
                    history.goBack();
                    return Promise.resolve();
                }

                if (lastState !== null && lastState.isGameStart === true) {
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

        const userList = state.userList.map(
            (userItem: ServerUserType, userIndex: number): ServerUserType => ({
                socketId: userItem.socketId,
                userId: userItem.userId,
                teamId: mapGuide.teamIdList[userIndex],
                type: userItem.type
            })
        );

        const map = state.settings && state.settings.map;

        if (!map) {
            console.error('---> map is not exists!!!!');
            return;
        }

        // eslint-disable-next-line complexity
        [].concat(map.buildings, map.units).forEach((userItem: BuildingType | UnitType) => {
            const userItemUserId = isString(userItem.userId) ? userItem.userId : null;

            if (isNotString(userItem.id) || userItem.id === '') {
                // eslint-disable-next-line no-param-reassign
                userItem.id = [userItem.x, userItem.y, Math.random()].join('_');
            }

            if (userItemUserId === null) {
                return;
            }

            const userIndex = parseInt(userItemUserId.replace(/\D/g, ''), 10) || 0;

            const userData = userList[userIndex];

            if (!userData) {
                Reflect.deleteProperty(userItem, 'userId');
                return;
            }

            // eslint-disable-next-line no-param-reassign
            userItem.userId = userData.userId;
        });

        /*
        const setSettingResult = await serverApi.setRoomSetting(roomId, {
            userList
        });
        */

        const setSettingResult = await serverApi.setRoomSetting(roomId, {
            map
        });

        const newState = {
            isGameStart: true,
            activeUserId: user.getId(),
            map
        };

        const pushStateResult = await serverApi.pushState(roomId, user.getId(), {
            type: roomPushState,
            state: newState
        });
    }

    renderUserList(): Node | null {
        const view = this;
        const {props, state} = view;
        const {userList} = state;
        const {match} = props;
        const myPlayerIndex = view.getMyPlayerIndex();
        const roomId = match.params.roomId || '';

        if (userList.length === 0) {
            return null;
        }

        return (
            <div className={style.user_list__wrapper}>
                {userList.map(
                    (userData: ServerUserType, userIndex: number): Node => {
                        return (
                            <div
                                className={style.user_list__item + ' ' + serviceStyle.clear_self}
                                key={userData.userId}
                            >
                                {myPlayerIndex === 0 && myPlayerIndex !== userIndex ?
                                    <Button
                                        className={style.user_list__remove_user_button}
                                        onClick={async (): Promise<void> => {
                                            await view.showSpinner();
                                            await view.removeUser(userData.userId);
                                            await view.hideSpinner();
                                        }}
                                    >
                                        X
                                    </Button> :
                                    null}
                                <div className={style.user_list__text}>
                                    <p className={serviceStyle.ellipsis}>
                                        {userIndex + 1}
                                        {': '}
                                        <Locale
                                            stringKey={((userData.type === 'human' ? 'HUMAN' : 'BOT'): LangKeyType)}
                                        />
                                        {myPlayerIndex === userIndex ?
                                            [' (', <Locale key="you" stringKey={('YOU': LangKeyType)}/>, ')'] :
                                            null}
                                    </p>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }

    renderForm(): Node {
        const view = this;
        const {props, state} = view;
        const {settings, userList} = state;

        if (!settings) {
            return null;
        }

        const {map} = settings;
        const mapSize = getMapSize(map);

        return (
            <Form>
                <Fieldset>
                    <FormHeader>
                        <Locale stringKey={('PLAYERS': LangKeyType)}/>
                        {[' (', userList.length, '/', getMaxUserListSize(map), '):'].join('')}
                    </FormHeader>
                    {view.renderUserList()}

                    <FormHeader>
                        <Locale stringKey={('MAP': LangKeyType)}/>:
                    </FormHeader>
                    <p className={createRoomStyle.map_size}>
                        {['(', getMaxUserListSize(map), ') [', mapSize.width, ' x ', mapSize.height, '] '].join('')}
                        {map.meta[props.locale.name].name}
                    </p>
                    <MapPreview
                        className={createRoomStyle.map_preview + ' ' + style.map_preview}
                        canvasClassName={createRoomStyle.map_preview_canvas}
                        key="map-preview"
                        map={settings.map}
                    />
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
                className={classnames({
                    [serviceStyle.disabled]: userList.length === 1
                })}
                onClick={async (): Promise<void> => {
                    await view.showSpinner();
                    await view.startGame();
                    await view.hideSpinner();
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
                    await view.showSpinner();
                    await serverApi.makeUser('bot', roomId);
                    await view.hideSpinner();
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
                        await view.showSpinner();
                        await serverApi.makeUser('human', roomId);
                        await view.hideSpinner();
                    }}
                >
                    <Locale stringKey={('ADD_HUMAN': LangKeyType)}/>
                </Button>
            );
        }

        return buttonList;
    }

    // eslint-disable-next-line complexity
    render(): Node {
        const view = this;
        const {props, state} = view;
        const {settings, userList, isGameStart, isRoomDataFetching} = state;
        const roomId = props.match.params.roomId || '';
        const myPlayerIndex = view.getMyPlayerIndex();

        if (isGameStart === true) {
            return <Game roomId={roomId}/>;
        }

        return (
            <Page>
                <Spinner isOpen={isRoomDataFetching}/>
                <Header>{settings ? settings.map.meta[props.locale.name].name : '\u00A0'}</Header>
                <Scroll>{view.renderForm()}</Scroll>

                {myPlayerIndex === 0 ?
                    <ButtonListWrapper className={style.button_list_wrapper}>
                        {view.renderMasterButtonList()}
                    </ButtonListWrapper> :
                    <BottomBar>
                        <Locale stringKey={('WAIT_FOR_START': LangKeyType)}/>
                    </BottomBar>
                }
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
