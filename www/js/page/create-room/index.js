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
import * as mapHash from './../../maps/default/map-list';
import type {ContextRouter} from 'react-router-dom';
import {getRoomType, isOnLineRoomType} from './../../components/game/model/helper';

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

    render(): Node {
        const view = this;
        const {state} = view;

        return (
            <Page>
                <Header>
                    Create Game
                </Header>

                <Form className="grow-1">

                    <Fieldset>
                        <FormHeader>
                            select map
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
                                            {' '}
                                            {mapIndex === state.mapIndex ? '<-' : ''}
                                        </h3>
                                    </div>
                                );
                            })}
                    </Fieldset>

                    <Fieldset>
                        <FormHeader>
                            Money
                        </FormHeader>

                        {mapGuide.defaultMoneyList
                            .map((defaultMoney: number): Node => {
                                return (
                                    <div
                                        onClick={(): void => view.setState({defaultMoney})}
                                        key={defaultMoney}
                                    >
                                        {defaultMoney}
                                        {' '}
                                        {defaultMoney === state.defaultMoney ? '<-' : ''}
                                    </div>
                                );
                            })}
                    </Fieldset>

                    <Fieldset>
                        <FormHeader>
                            Unit Limit
                        </FormHeader>

                        {mapGuide.defaultUnitLimitList
                            .map((unitLimit: number): Node => {
                                return (
                                    <div
                                        onClick={(): void => view.setState({unitLimit})}
                                        key={unitLimit}
                                    >
                                        {unitLimit}
                                        {' '}
                                        {unitLimit === state.unitLimit ? '<-' : ''}
                                    </div>
                                );
                            })}
                    </Fieldset>
                </Form>

                <Button
                    onClick={async (): Promise<void> => {
                        const result = await view.createRoom();
                    }}
                >
                    create room
                </Button>
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
