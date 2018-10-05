// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {MapType} from '../../maps/type';
import mapGuide from '../../maps/map-guide';
import * as serverApi from '../../module/server-api';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import type {AuthType} from '../../component/auth/reducer';
import routes from '../../component/app/routes';
import Page from '../../component/ui/page/c-page';
import Button from '../../component/ui/button/c-button';
import Header from '../../component/ui/header/c-header';
import Form from '../../component/ui/form/c-form';
import FormHeader from '../../component/ui/form-header/c-form-header';
import Fieldset from '../../component/ui/fieldset/c-fieldset';
import Select from '../../component/ui/select/c-select';
import MapPreview from '../../component/ui/map-preview/c-map-preview';
import type {SelectIconNameType} from '../../component/ui/select/icon/c-icon';
import mapHash from '../../maps/default/map-list';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import {getMapSize, getRoomType, isOnLineRoomType} from '../../component/game/model/helper';
import serviceStyle from '../../../css/service.scss';
import style from './style.scss';
import type {LangKeyType} from '../../component/locale/translation/type';
import Locale from '../../component/locale/c-locale';
import type {LocaleType} from '../../component/locale/reducer';
import Scroll from '../../component/ui/scroll/c-scroll';
import {getMaxUserListSize} from '../join-room/helper';
import classnames from 'classnames';
import Spinner from '../../component/ui/spinner/c-spinner';

const mapList: Array<MapType> = Object.keys(mapHash).map((mapName: string): MapType => mapHash[mapName]);

type StateType = {|
    mapIndex: number,
    defaultMoney: number,
    unitLimit: number,
    openShowInfoMapList: Array<string>,
    isRoomCreating: boolean
|};

type PropsType = {|
    ...$Exact<ContextRouterType>,
    auth: AuthType,
    locale: LocaleType
|};

class CreateRoom extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            mapIndex: 0,
            defaultMoney: mapGuide.defaultMoneyList[0],
            unitLimit: mapGuide.defaultUnitLimitList[0],
            openShowInfoMapList: [],
            isRoomCreating: false
        };
    }

    addToShowInfoMapList(mapName: string) {
        const view = this;
        const {state} = view;
        const currentRoomList = JSON.parse(JSON.stringify(state.openShowInfoMapList));

        if (currentRoomList.includes(mapName)) {
            console.error(mapName, 'already in openShowInfoMapList');
            return;
        }

        currentRoomList.push(mapName);

        view.setState({openShowInfoMapList: currentRoomList});
    }

    removeFromShowInfoMapList(mapName: string) {
        const view = this;
        const {state} = view;
        const currentRoomList = JSON.parse(JSON.stringify(state.openShowInfoMapList));

        if (!currentRoomList.includes(mapName)) {
            console.error(mapName, 'has no exists in openShowInfoMapList');
            return;
        }

        currentRoomList.splice(currentRoomList.indexOf(mapName), 1);

        view.setState({openShowInfoMapList: currentRoomList});
    }

    // eslint-disable-next-line max-statements
    async createRoom(): Promise<string | null> {
        const view = this;
        const {props, state} = view;
        const {auth, history} = props;

        view.setState({isRoomCreating: true});

        const createRoomResult = await serverApi.createRoom();

        view.setState({isRoomCreating: false});

        if (createRoomResult.roomId === '') {
            console.error('can not create a room');
            return null;
        }

        const {mapIndex, defaultMoney, unitLimit} = state;
        const map = JSON.parse(JSON.stringify(mapList[mapIndex]));
        const socketId = auth.socket.id;
        const userId = auth.user.id;

        map.unitLimit = unitLimit;
        map.defaultMoney = defaultMoney;
        map.userList = [];

        map.activeUserId = userId;

        view.setState({isRoomCreating: true});

        const setAllRoomSettingsResult = await serverApi.setAllRoomSettings(createRoomResult.roomId, {
            map,
            type: getRoomType()
            // userList: [{
            //     userId,
            //     socketId,
            //     teamId: mapGuide.teamIdList[0]
            // }]
        });

        const joinRoomResult = await serverApi.joinRoom(createRoomResult.roomId, userId, socketId);

        view.setState({isRoomCreating: false});

        if (joinRoomResult.roomId === '') {
            return null;
        }

        if (isOnLineRoomType()) {
            history.push(routes.roomOnLine.replace(':roomId', joinRoomResult.roomId));
        } else {
            history.push(routes.roomOffLine.replace(':roomId', joinRoomResult.roomId));
        }

        return joinRoomResult.roomId;
    }

    senderMoneySelect(): Node {
        const view = this;

        return (
            <Fieldset className={serviceStyle.line_item}>
                <Select
                    icon={('MONEY': SelectIconNameType)}
                    onChange={(defaultMoney: string) => {
                        view.setState({defaultMoney: parseInt(defaultMoney, 10)});
                    }}
                >
                    {mapGuide.defaultMoneyList.map(
                        (defaultMoney: number): Node => {
                            return (
                                <option value={defaultMoney} key={defaultMoney}>
                                    {defaultMoney}
                                </option>
                            );
                        }
                    )}
                </Select>
            </Fieldset>
        );
    }

    senderUnitLimitSelect(): Node {
        const view = this;

        return (
            <Fieldset className={serviceStyle.line_item}>
                <Select
                    icon={('UNIT': SelectIconNameType)}
                    onChange={(unitLimit: string) => {
                        view.setState({unitLimit: parseInt(unitLimit, 10)});
                    }}
                >
                    {mapGuide.defaultUnitLimitList.map(
                        (unitLimit: number): Node => {
                            return (
                                <option value={unitLimit} key={unitLimit}>
                                    {unitLimit}
                                </option>
                            );
                        }
                    )}
                </Select>
            </Fieldset>
        );
    }

    renderSelectMap(): Node {
        const view = this;
        const {props, state} = view;
        const {openShowInfoMapList} = state;

        return (
            <Scroll>
                {mapList.map(
                    (map: MapType, mapIndex: number): Node => {
                        const mapId = map.meta['en-US'].name;
                        const isAdditionalInfoOpen = openShowInfoMapList.includes(mapId);
                        const mapSize = getMapSize(map);

                        return (
                            <div key={mapId} className={classnames(style.map_item, serviceStyle.clear_self)}>
                                {isAdditionalInfoOpen ?
                                    <Button
                                        onClick={(): void => view.removeFromShowInfoMapList(mapId)}
                                        className={style.button__show_info}
                                    >
                                        [-]
                                    </Button> :
                                    <Button
                                        onClick={(): void => view.addToShowInfoMapList(mapId)}
                                        className={style.button__show_info}
                                    >
                                        [+]
                                    </Button>
                                }

                                <Button
                                    onClick={() => {
                                        view.setState(
                                            {mapIndex},
                                            async (): Promise<void> => {
                                                const result = await view.createRoom();
                                            }
                                        );
                                    }}
                                    className={style.button__create_room}
                                >
                                    &gt;&gt;
                                </Button>

                                <div className={style.map_item__map_name}>
                                    <p className={serviceStyle.ellipsis}>
                                        {'(' + getMaxUserListSize(map) + ') '}
                                        {map.meta[props.locale.name].name}
                                    </p>
                                    <p className={style.map_size}>
                                        {'['}
                                        {mapSize.width}
                                        {' x '}
                                        {mapSize.height}
                                        {']'}
                                    </p>
                                </div>

                                {isAdditionalInfoOpen ?
                                    <MapPreview
                                        className={style.map_preview}
                                        canvasClassName={style.map_preview_canvas}
                                        key="map-preview"
                                        map={map}
                                    /> :
                                    null}
                            </div>
                        );
                    }
                )}
            </Scroll>
        );
    }

    render(): Node {
        const view = this;
        const {state} = view;

        return (
            <Page>
                <Spinner isOpen={state.isRoomCreating}/>
                <Header>
                    <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                </Header>

                <Form className={style.map_list__form}>
                    <div className={serviceStyle.line}>
                        {view.senderMoneySelect()}
                        {view.senderUnitLimitSelect()}
                    </div>
                    <FormHeader>
                        <Locale stringKey={('MAPS': LangKeyType)}/>:
                    </FormHeader>
                </Form>
                {view.renderSelectMap()}
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
)(CreateRoom);