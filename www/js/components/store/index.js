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
import guideUnitData, {additionalUnitData} from './../game/model/unit/unit-guide';
import type {UnitTypeAllType} from './../game/model/unit/unit-guide';
import {withRouter} from 'react-router-dom';
import type {ContextRouter} from 'react-router-dom';
import type {UnitType} from '../../maps/type';
import serviceStyle from './../../../css/service.scss';
import {getSupplyState} from '../game/model/helper';

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

    buyUnit(unitType: UnitTypeAllType): Promise<void> { // eslint-disable-line max-statements
        const view = this;
        const {props, state} = view;
        const newMap: MapType = JSON.parse(JSON.stringify(props.map));
        const newMapUserData = find(newMap.userList, {userId: user.getId()}) || null;
        // const newUnitData = guideUnitData[unitType];

        if (newMapUserData === null) {
            console.error('can not find map user with id', user.getId(), newMap);
            return Promise.resolve();
        }

        const unitCost = view.getUnitCost(unitType);

        if (unitCost === null) {
            console.error('Can not get unit cost');
            return Promise.resolve();
        }

        newMapUserData.money -= unitCost;

        if (!newMapUserData.commander) {
            console.error('User has no Commander');
            return Promise.resolve();
        }

        newMapUserData.commander.buyCount += 1;

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

    renderUnitData(unitType: UnitTypeAllType): Node | null {
        const view = this;
        const {props, state} = view;
        const {mapUserData} = state;
        const unitData = guideUnitData[unitType];
        const unitCost = view.getUnitCost(unitType);

        if (unitCost === null) {
            return null;
        }

        if (mapUserData === null) {
            console.error('mapUserData is not define');
            return null;
        }

        const supplyState = getSupplyState(props.map, user.getId());

        /*
                const userCommander = mapUserData.commander || null;

                if (userCommander === null) {
                    console.error('userCommander is not define');
                    return null;
                }

                // show unit which can be buy only
                if (unitData.canBeBuy !== true) {
                    return null;
                }

                const isCommander = typeof unitData.isCommander === 'boolean' && unitData.isCommander;

                // hide extra commanders
                if (isCommander && userCommander.type !== unitType) {
                    return null;
                }

                // detect user's commander on map
                const isCommanderLive = Boolean(find(props.map.units, {type: userCommander.type}));
        */

        return <div
            className={mapUserData.money < unitCost || supplyState.isFull ? serviceStyle.disabled : ''}
            key={unitType}>
            <hr/>
            {unitType}: {JSON.stringify(unitData)}<br/>
            COST: {unitCost}

            <div onClick={() => {
                view.buyUnit(unitType);
            }}>
                --------------<br/>
                -- buy unit --<br/>
                --------------
            </div>
            <hr/>
        </div>;
    }

    getUnitCost(unitType: UnitTypeAllType): number | null { // eslint-disable-line complexity, max-statements
        const view = this;
        const {props, state} = view;
        const {mapUserData} = state;
        const unitData = guideUnitData[unitType];

        if (unitData.canBeBuy !== true) {
            return null;
        }

        const cost = typeof unitData.cost === 'number' ? unitData.cost : null;

        if (cost === null) {
            console.error('unit canBeBuy but without cost');
            return null;
        }

        const isCommander = typeof unitData.isCommander === 'boolean' && unitData.isCommander;

        if (!isCommander) {
            return cost;
        }

        if (mapUserData === null) {
            console.error('mapUserData is not define');
            return null;
        }

        const userCommander = mapUserData.commander || null;

        if (userCommander === null) {
            console.error('userCommander is not define');
            return null;
        }

        if (userCommander.type !== unitType) {
            return null;
        }

        // detect user's commander on map
        const isCommanderLive = Boolean(find(props.map.units, {type: userCommander.type}));

        if (isCommanderLive) {
            return null;
        }

        return cost + userCommander.buyCount * additionalUnitData.additionalCommanderCost;
    }

    renderUnitList(): Array<Node | null> {
        const view = this;

        return Object.keys(guideUnitData)
            .map((unitType: UnitTypeAllType): Node | null => view.renderUnitData(unitType));
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
            <hr/>
            <div onClick={() => {
                props.history.goBack();
            }}>
                ----------<br/>
                -- BACK --<br/>
                ----------
            </div>

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
