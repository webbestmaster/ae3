// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import {connect} from 'react-redux';
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
import classNames from 'classnames';
import {getSupplyState, isCommanderLive} from '../game/model/helper';
import serviceStyle from '../../../css/service.scss';
import Page from '../ui/page/c-page';
import Button from '../ui/button/c-button';
import Header from '../ui/header/c-header';
import BottomBar from '../ui/bottom-bar/c-bottom-bar';
import Scroll from '../ui/scroll/c-scroll';
import style from './style.scss';
import {isBoolean, isNumber} from '../../lib/is/is';
import Spinner from '../ui/spinner/c-spinner';
import Locale from '../locale/c-locale';
import type {LangKeyType} from '../locale/translation/type';
import type {TeamIdType} from '../../maps/map-guide';
import UnitSellPosition from './unit-sell-position/c-unit-sell-position';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import {setOpenFromGame} from './action';
import type {SetOpenFromGameType} from './action';
import type {StoreType} from './reducer';

const storeViewId = 'store';

export {storeViewId};

type PassedPropsType = {|
    +x: number,
    +y: number,
    +map: MapType,
    +children: Node | Array<Node>
|};

type ReduxPropsType = {
    +store: StoreType
};

type ReduxActionType = {|
    setOpenFromGame: (isOpenFromGame: boolean) => SetOpenFromGameType
|};

const reduxAction: ReduxActionType = {
    setOpenFromGame
    // setSmth // imported from actions
};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
        +match: {
            +params: {
                +roomId: string
            }
        }
    }>>;

type StateType = {
    // +mapUserData: MapUserType,
    // +isInProgress: boolean
};

type RefsType = {||};

class Store extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {

            /*
            mapUserData: find(props.map.userList, {userId: user.getId()}) || {
                userId: 'no-user-id-in-store',
                money: 0,
                teamId: 'team-0'
            },
            isInProgress: false
*/
        };
    }

    componentDidMount() {
        const view = this;
        const {props} = view;
        const {history, store} = props;

        if (store.isOpenFromGame === true) {
            props.setOpenFromGame(false);
            return;
        }

        console.log('store did NOT open from game, probaby from url, go back');
        history.goBack();
    }

    renderUnitData(unitType: UnitTypeAllType): Node {
        const view = this;
        const {props, state} = view;
        // const {mapUserData} = state;
        // const unitData = guideUnitData[unitType];
        // const unitCost = view.getUnitCost(unitType);

        return <UnitSellPosition unitType={unitType} x={props.x} y={props.y} map={props.map} key={unitType}/>;

        /*
        if (unitCost === null) {
            return null;
        }
*/

        /*
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
*/
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
                <Header>
                    <Locale stringKey={('CASTLE': LangKeyType)}/>
                </Header>

                <Scroll>{view.renderUnitList()}</Scroll>

                {props.children}
            </Page>
        );
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        store: state.store
    }),
    reduxAction
)(withRouter(Store));
