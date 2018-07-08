// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {MapType} from './../../maps/type';
import mapGuide from './../../maps/map-guide';
import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './../../components/auth/reducer';
import routes from './../../app/routes';
import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import Header from './../../components/ui/header';
import Form from './../../components/ui/form';
import FormHeader from './../../components/ui/form-header';
import Fieldset from './../../components/ui/fieldset';
import Select from './../../components/ui/select';
import * as mapHash from './../../maps/default/map-list';
import type {ContextRouter} from 'react-router-dom';
import {getRoomType, isOnLineRoomType} from './../../components/game/model/helper';
import serviceStyle from './../../../css/service.scss';
import uiStyle from './../../components/ui/ui.scss';
import type {LangKeyType} from './../../components/locale/translation/type';
import Locale from './../../components/locale';

const mapList: Array<MapType> = Object.keys(mapHash).map((mapName: string): MapType => mapHash[mapName]);

type StateType = {|
    mapIndex: number,
    defaultMoney: number,
    unitLimit: number
|};

type PropsType = {|
    ...ContextRouter,
    auth: AuthType
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
            unitLimit: mapGuide.defaultUnitLimitList[0]
        };
    }

    async createRoom(): Promise<string | null> { // eslint-disable-line max-statements
        const view = this;
        const {props, state} = view;
        const {auth, history} = props;

        const createRoomResult = await serverApi.createRoom();

        if (createRoomResult.roomId === null) {
            console.error('can not create a room');
            return null;
        }

        const {mapIndex, defaultMoney, unitLimit} = state;
        const map: MapType = JSON.parse(JSON.stringify(mapList[mapIndex]));
        const socketId = auth.socket.id;
        const userId = auth.user.id;

        map.unitLimit = unitLimit;
        map.defaultMoney = defaultMoney;
        map.userList = [];

        /*
        map.userList = [{
            userId,
            teamId: mapGuide.teamIdList[0],
            money: defaultMoney
        }];
        */
        map.activeUserId = userId;

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
                <FormHeader>
                    <Locale stringKey={('MONEY': LangKeyType)}/>
                    :
                </FormHeader>

                <Select
                    onChange={(defaultMoney: string) => {
                        view.setState({defaultMoney: parseInt(defaultMoney, 10)});
                    }}
                >
                    {mapGuide.defaultMoneyList
                        .map((defaultMoney: number): Node => {
                            return (
                                <option
                                    value={defaultMoney}
                                    key={defaultMoney}
                                >
                                    {defaultMoney}
                                </option>
                            );
                        })}
                </Select>
            </Fieldset>
        );
    }

    senderUnitLimitSelect(): Node {
        const view = this;

        return (
            <Fieldset className={serviceStyle.line_item}>
                <FormHeader>
                    <Locale stringKey={('UNIT_LIMIT': LangKeyType)}/>
                    :
                </FormHeader>

                <Select
                    onChange={(unitLimit: string) => {
                        view.setState({unitLimit: parseInt(unitLimit, 10)});
                    }}
                >
                    {mapGuide.defaultUnitLimitList
                        .map((unitLimit: number): Node => {
                            return (
                                <option
                                    value={unitLimit}
                                    key={unitLimit}
                                >
                                    {unitLimit}
                                </option>
                            );
                        })}
                </Select>
            </Fieldset>
        );
    }

    renderSelectMap(): Node {
        const view = this;
        const {state} = view;

        return (
            <Fieldset>
                <FormHeader>
                    <Locale stringKey={('MAPS': LangKeyType)}/>
                    :
                </FormHeader>

                {mapList
                    .map((map: MapType, mapIndex: number): Node => {
                        return (
                            <div
                                onClick={(): void => view.setState({mapIndex})}
                                key={map.meta.en.name}
                            >
                                <h3>
                                    {map.meta.en.name}
                                    {mapIndex === state.mapIndex ? ' <-' : ' '}
                                </h3>
                            </div>
                        );
                    })}
            </Fieldset>
        );
    }

    render(): Node {
        const view = this;

        return (
            <Page>
                <Header>
                    <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                </Header>

                <Form className={serviceStyle.grow_1}>
                    <div className={serviceStyle.line}>
                        {view.senderMoneySelect()}
                        {view.senderUnitLimitSelect()}
                    </div>
                    {view.renderSelectMap()}
                </Form>

                <div className={uiStyle.single_button_wrapper}>
                    <Button
                        onClick={async (): Promise<void> => {
                            const result = await view.createRoom();
                        }}
                    >
                        <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                    </Button>
                </div>
            </Page>
        );
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {}
)(CreateRoom);
