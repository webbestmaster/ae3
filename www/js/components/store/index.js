// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import type {GlobalStateType} from './../../app-reducer';
import * as serverApi from './../../module/server-api';
import find from 'lodash/find';
import padStart from 'lodash/padStart';
import padEnd from 'lodash/padEnd';
import type {MapType, MapUserType, UnitType} from './../../maps/type';
import type {UnitTypeAllType} from './../game/model/unit/unit-guide';
import guideUnitData, {additionalUnitData} from './../game/model/unit/unit-guide';
import type {ContextRouter} from 'react-router-dom';
import withRouter from 'react-router-dom/withRouter';
import classnames from 'classnames';
import {getSupplyState, isCommanderLive} from './../game/model/helper';
import serviceStyle from './../../../css/service.scss';
import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import Header from './../../components/ui/header';
import BottomBar from './../../components/ui/bottom-bar';
import {storeAction} from './provider';
import Scroll from './../../components/ui/scroll';
import style from './style.scss';
import {
    isBoolean,
    isNumber,
    isString,
    isFunction,
    isNotBoolean,
    isNotNumber,
    isNotString,
    isNotFunction
} from './../../lib/is';

const storeViewId = 'store';

export {storeViewId};

type PropsType = {|
    ...ContextRouter,
    +x: number,
    +y: number,
    +map: MapType,
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
        const view = this;
        const {props} = view;
        const {history} = props;

        if (storeAction.getState().openFromGame === true) {
            storeAction.setOpenFromGame(false);
            return;
        }

        history.goBack();
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
            .then((response: mixed): void => console.log('---> user action buy unit', response))
            .catch((error: Error) => {
                console.error('store-push-state error');
                console.log(error);
            })
            .then((): void => props.history.goBack())
            .catch((error: Error) => {
                console.error('error with props.history.goBack()');
                console.error(error);
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

        return (
            <Button
                className={classnames(
                    serviceStyle.w75_c,
                    serviceStyle.ta_l,
                    {[serviceStyle.disabled]: mapUserData.money < unitCost || supplyState.isFull}
                )}
                onClick={() => {
                    view.buyUnit(unitType);
                }}
                key={unitType}
            >
                <span>
                    {padEnd(unitType, 10, ' ')}
                    &nbsp;|&nbsp;
                    attack:
                    {unitData.attack.min}
                    -
                    {unitData.attack.max}
                    <br/>
                    COST:
                    {padStart(String(unitCost), 4, ' ')}
                    &nbsp;|&nbsp;
                    move:
                    {unitData.move}
                </span>
            </Button>
        );
    }

    getUnitCost(unitType: UnitTypeAllType): number | null { // eslint-disable-line complexity, max-statements
        const view = this;
        const {props, state} = view;
        const {mapUserData} = state;
        const unitData = guideUnitData[unitType];

        if (unitData.canBeBuy !== true) {
            return null;
        }

        const cost = isNumber(unitData.cost) ? unitData.cost : null;

        if (cost === null) {
            console.error('unit canBeBuy but without cost');
            return null;
        }

        const isCommander = isBoolean(unitData.isCommander) && unitData.isCommander;

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
        if (isCommanderLive(user.getId(), props.map)) {
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

        const supplyState = getSupplyState(props.map, user.getId());

        if (state.mapUserData === null) {
            console.error('ERROR with state.mapUserData', state);
            return (
                <Page>
                    <Header>
                        ERROR with state.mapUserData
                    </Header>
                </Page>
            );
        }

        if (state.isInProgress) {
            return (
                <Page>
                    <Header>
                        Waiting...
                    </Header>
                </Page>
            );
        }

        return (
            <Page>
                <Header className={serviceStyle.ta_r}>
                    Store
                </Header>

                <div className={style.unit_list_wrapper}>
                    <Scroll>
                        {view.renderUnitList()}
                    </Scroll>
                </div>

                <BottomBar
                    className={serviceStyle.ta_l}
                >
                    Money:
                    {' '}
                    {state.mapUserData && state.mapUserData.money ? state.mapUserData.money : 0}
                    {' '}
                    $
                    &nbsp;|&nbsp;
                    {supplyState.unitCount}
                    {' '}
                    /
                    {supplyState.unitLimit}
                    {' '}
                    웃
                </BottomBar>
            </Page>
        );
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
