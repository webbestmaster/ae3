// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from './../../index';
import type {SystemType} from './../system/reducer';
// import Game from './model/index';
import type {SocketMessageType} from './../../module/socket';
import * as serverApi from './../../module/server-api';
import MainModel from './../../lib/main-model';
import type {AllRoomSettingsType, ServerUserType} from './../../module/server-api';
import ReactJson from 'react-json-view';
import find from 'lodash/find';
// import Unit from './model/unit';
import type {MapUserType} from './../../maps/type';
import type {MapType, LandscapeType, BuildingType, GraveType} from './../../maps/type';
import unitData from './../game/model/unit/unit-guide';
import type {UnitTypeType} from './../game/model/unit/unit-guide';
import {withRouter} from 'react-router-dom';
import type {ContextRouter} from 'react-router-dom';
import type {UnitType} from '../../maps/type';

const storeViewId = 'store';

export {storeViewId};

type PropsType = {|
    +x: number,
    +y: number,
    +map: MapType,
    ...ContextRouter,
    +match: {|
        +params: {|
            +roomId: string
        |}
    |}
|};

type StateType = {|
    mapUserData: MapUserType | null,
    isInProgress: boolean
|};

type RefsType = {||};

class Store extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            mapUserData: find(props.map.userList, {userId: user.getId()}) || null,
            isInProgress: false
        };
    }

    componentDidMount() {

    }

    buyUnit(unitType: UnitTypeType): Promise<void> {
        const view = this;
        const {props, state} = view;
        const newMap: MapType = JSON.parse(JSON.stringify(props.map));
        const newMapUserData = find(newMap.userList, {userId: user.getId()}) || null;
        const newUnitData = unitData[unitType];

        if (newMapUserData === null) {
            console.error('can not find map user with id', user.getId(), newMap);
            return Promise.resolve();
        }

        newMapUserData.money -= newUnitData.cost;

        const newMapUnitData: UnitType = {
            type: unitType,
            x: props.x,
            y: props.y,
            userId: user.getId(),
            id: [props.x, props.y, Math.random()].join('-')
        };

        newMap.units.push(newMapUnitData);

        view.setState({isInProgress: true});

        return serverApi
            .pushState(
                props.match.params.roomId,
                user.getId(),
                {
                    type: 'room__push-state',
                    state: {
                        type: 'buy-unit',
                        newMapUnit: newMapUnitData,
                        map: newMap,
                        activeUserId: user.getId()
                    }
                }
            )
            .then((response: mixed) => {
                console.log('---> unit action move pushed');
                console.log(response);
                props.history.goBack();
            });
    }

    renderUnitList(): Array<Node> {
        const view = this;
        const {props, state} = view;

        return Object.keys(unitData)
            .map((unitType: UnitTypeType): Node => <div key={unitType}>
                <hr/>
                {unitType}: {JSON.stringify(unitData[unitType])}
                <div onClick={() => {
                    view.buyUnit(unitType);
                }}>
                    --------------<br/>
                    -- buy unit --<br/>
                    --------------
                </div>
                <hr/>
            </div>);
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        if (state.mapUserData === null) {
            console.error('ERROR with state.mapUserData');
            return <div>ERROR with state.mapUserData</div>;
        }

        return <div>
            <h1>---</h1>
            <h1>store</h1>
            <h1>x: {props.x} - y: {props.y}</h1>
            <h1>store</h1>
            <h1>---</h1>
            <div className="json">{JSON.stringify(props.map)}</div>

            <hr/>
            current user data: {JSON.stringify(state.mapUserData)}

            {state.isInProgress ? <div>---- WAIT FOR SERVER ----</div> : view.renderUnitList()}

            <hr/>
            <hr/>

        </div>;
    }
}

export default withRouter(connect(
    (state: GlobalStateType): {} => ({
        system: state.system
    }),
    {
        // setUser
    }
)(Store));
