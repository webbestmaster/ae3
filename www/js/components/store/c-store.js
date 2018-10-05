// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {user} from '../../module/user';
import * as serverApi from '../../module/server-api';
import find from 'lodash/find';
import padStart from 'lodash/padStart';
import padEnd from 'lodash/padEnd';
import type {MapType, MapUserType, UnitType} from '../../maps/type';
import type {UnitTypeAllType} from '../game/model/unit/unit-guide';
import guideUnitData, {additionalUnitData} from '../game/model/unit/unit-guide';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import withRouter from 'react-router-dom/withRouter';
import classnames from 'classnames';
import {getSupplyState, isCommanderLive} from '../game/model/helper';
import serviceStyle from '../../../css/service.scss';
import Page from '../ui/page/c-page';
import Button from '../ui/button/c-button';
import Header from '../ui/header/c-header';
import BottomBar from '../ui/bottom-bar/c-bottom-bar';
import {storeAction} from './provider';
import Scroll from '../ui/scroll/c-scroll';
import style from './style.scss';
import {isBoolean, isNumber} from '../../lib/is/is';
import Spinner from '../ui/spinner/c-spinner';
import Locale from '../locale/c-locale';
import type {LangKeyType} from '../locale/translation/type';
import type {TeamIdType} from '../../maps/map-guide';

const storeViewId = 'store';

export {storeViewId};

type PropsType = {|
    ...$Exact<ContextRouterType>,
    +x: number,
    +y: number,
    +map: MapType,
    +match: {|
        +params: {|
            +roomId: string
        |}
    |},
    +children: Array<Node>
|};

type StateType = {|
    mapUserData: MapUserType,
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
            mapUserData: find(props.map.userList, {userId: user.getId()}) || {
                userId: 'no-user-id-in-store',
                money: 0,
                teamId: 'team-0'
            },
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

    // eslint-disable-next-line max-statements
    buyUnit(unitType: UnitTypeAllType): Promise<void> {
        const view = this;
        const {props, state} = view;
        const newMap = JSON.parse(JSON.stringify(props.map));
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

        const newMapUnitData = {
            type: unitType,
            x: props.x,
            y: props.y,
            userId: user.getId(),
            id: [props.x, props.y, Math.random()].join('-')
        };

        newMap.units.push(newMapUnitData);

        view.setState({isInProgress: true});

        return serverApi
            .pushState(props.match.params.roomId, user.getId(), {
                type: 'room__push-state',
                state: {
                    type: 'buy-unit',
                    newMapUnit: newMapUnitData,
                    map: newMap,
                    activeUserId: user.getId()
                }
            })
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

        const supplyState = getSupplyState(props.map, user.getId());

        return (
            <Button
                className={classnames(serviceStyle.w75_c, serviceStyle.ta_l, {
                    [serviceStyle.disabled]: mapUserData.money < unitCost || supplyState.isFull
                })}
                onClick={() => {
                    view.buyUnit(unitType);
                }}
                key={unitType}
            >
                <span>
                    {padEnd(unitType, 10, ' ')}
                    &nbsp;|&nbsp; attack:
                    {unitData.attack.min}-{unitData.attack.max}
                    <br/>
                    COST:
                    {padStart(String(unitCost), 4, ' ')}
                    &nbsp;|&nbsp; move:
                    {unitData.move}
                </span>
            </Button>
        );
    }

    // eslint-disable-next-line complexity, max-statements
    getUnitCost(unitType: UnitTypeAllType): number | null {
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

        return Object.keys(guideUnitData).map(
            (unitType: UnitTypeAllType): Node | null => view.renderUnitData(unitType)
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <Page>
                <Spinner isOpen={state.isInProgress}/>

                <Header>
                    <Locale stringKey={('CASTLE': LangKeyType)}/>
                </Header>

                <Scroll>{view.renderUnitList()}</Scroll>

                {props.children}
            </Page>
        );
    }
}

export default withRouter(Store);
