// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {routes} from '../../component/app/routes';
import * as serverApi from '../../module/server-api';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import type {AuthType} from '../../component/auth/reducer';
import {Page} from '../../component/ui/page/c-page';
import {Header} from '../../component/ui/header/c-header';
import {Fieldset} from '../../component/ui/fieldset/c-fieldset';
import type {RoomDataType} from './helper';
import {getRoomState} from './helper';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import {isOnLineRoomType} from '../../component/game/model/helper';
import serviceStyle from '../../../css/service.scss';
import type {LangKeyType} from '../../component/locale/translation/type';
import {Locale} from '../../component/locale/c-locale';
import {ButtonListWrapper} from '../../component/ui/button-list-wrapper/c-button-list-wrapper';
import buttonListWrapperStyle from '../../component/ui/button-list-wrapper/style.scss';
import {ButtonLink} from '../../component/ui/button-link/c-button-link';
import {Button} from '../../component/ui/button/c-button';
import type {LocaleType} from '../../component/locale/reducer';
import style from './style.scss';
import {Scroll} from '../../component/ui/scroll/c-scroll';
import classNames from 'classnames';
import {Spinner} from '../../component/ui/spinner/c-spinner';

type ReduxPropsType = {|
    +auth: AuthType,
    +locale: LocaleType,
|};

type ReduxActionType = {};

const reduxAction: ReduxActionType = {};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
    }>>;

type StateType = {|
    +roomDataList: Array<RoomDataType> | null,
    +isRoomsFetching: boolean,
|};

class JoinRoom extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            roomDataList: null,
            isRoomsFetching: false,
        };
    }

    async showSpinner(): Promise<void> {
        const view = this;

        return new Promise((resolve: () => void) => {
            view.setState({isRoomsFetching: true}, () => {
                // user have to see spinner
                window.setTimeout(resolve, 1e3);
            });
        });
    }

    async hideSpinner(): Promise<void> {
        const view = this;

        return new Promise((resolve: () => void) => {
            view.setState({isRoomsFetching: false}, resolve);
        });
    }

    async componentDidMount(): Promise<void> {
        const view = this;

        await view.showSpinner();

        const getAllRoomIdsResult = await serverApi.getAllRoomIds();
        const roomDataList = [];

        // eslint-disable-next-line no-loops/no-loops
        for (let roomIndex = 0; roomIndex < getAllRoomIdsResult.roomIds.length; roomIndex += 1) {
            roomDataList.push(await getRoomState(getAllRoomIdsResult.roomIds[roomIndex]));
        }

        view.setState({roomDataList});
        await view.hideSpinner();
    }

    handleOnClickRefresh = () => {
        const view = this;

        view.componentDidMount()
            .then((): void => console.log('page refreshed'))
            .catch(
                (error: Error): Error => {
                    console.error('can not refresh page');
                    console.error(error);
                    return error;
                }
            );
    };

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

    renderRefreshButton(): Node {
        const view = this;
        const {state} = view;
        const {roomDataList} = state;

        if (roomDataList === null) {
            return null;
        }

        return (
            <ButtonListWrapper
                className={
                    roomDataList.length === 0 ?
                        style.bottom_button_list_wrapper__no_rooms :
                        style.bottom_button_list_wrapper
                }
            >
                <Button onClick={view.handleOnClickRefresh}>
                    <Locale stringKey={('REFRESH': LangKeyType)}/>
                </Button>
            </ButtonListWrapper>
        );
    }

    makeJoinFunction(roomId: string): () => Promise<void> {
        const view = this;

        return async (): Promise<void> => {
            await view.showSpinner();
            await view.joinRoom(roomId);
            await view.hideSpinner();
        };
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
                            <span className={serviceStyle.zero_opacity}>{'\u2026'}</span>
                            <Locale stringKey={('LOADING': LangKeyType)}/>
                            {'\u2026'}
                        </Fieldset>
                    </ButtonListWrapper>
                </Page>
            );
        }

        if (roomDataList.length === 0) {
            return (
                <Page>
                    {JoinRoom.renderHeader()}
                    <Spinner isOpen={isRoomsFetching}/>
                    <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                        <Fieldset className={serviceStyle.ta_c}>
                            <Locale stringKey={('MESSAGE__NO_OPEN_GAME': LangKeyType)}/>
                        </Fieldset>
                        <ButtonLink to={routes.createRoomOnline}>
                            <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                        </ButtonLink>
                    </ButtonListWrapper>
                    {view.renderRefreshButton()}
                </Page>
            );
        }

        return (
            <Page>
                {JoinRoom.renderHeader()}
                <Spinner isOpen={isRoomsFetching}/>
                <Scroll>
                    {roomDataList.map(
                        (roomData: RoomDataType): Node => {
                            return (
                                <Button
                                    onClick={view.makeJoinFunction(roomData.roomId)}
                                    className={classNames(style.open_room_item, {
                                        [serviceStyle.disabled]: roomData.userList.length === roomData.maxUserSize,
                                    })}
                                    key={roomData.roomId}
                                >
                                    <div className={style.right_arrow}>&gt;&gt;</div>
                                    <p className={style.map_name}>
                                        {'['}
                                        {roomData.userList.length}
                                        {'/'}
                                        {roomData.maxUserSize}
                                        {'] '}
                                        {roomData.settings.map.meta[props.locale.name].name}
                                    </p>
                                </Button>
                            );
                        }
                    )}
                </Scroll>
                {view.renderRefreshButton()}
            </Page>
        );
    }
}

const ConnectedComponent = connect<ComponentType<JoinRoom>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        auth: state.auth,
        locale: state.locale,
    }),
    reduxAction
)(JoinRoom);

export {ConnectedComponent as JoinRoom};
