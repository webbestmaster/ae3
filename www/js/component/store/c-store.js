// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {MapType} from '../../maps/type';
import type {UnitTypeAllType} from '../game/model/unit/unit-guide';
import {unitGuideData} from '../game/model/unit/unit-guide';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import withRouter from 'react-router-dom/withRouter';
import Page from '../ui/page/c-page';
import Header from '../ui/header/c-header';
import Scroll from '../ui/scroll/c-scroll';
import Locale from '../locale/c-locale';
import type {LangKeyType} from '../locale/translation/type';
import UnitSellPosition from './unit-sell-position/c-unit-sell-position';
import type {GlobalStateType} from '../../redux-store-provider/app-reducer';
import type {SetOpenFromGameType} from './action';
import {setOpenFromGame} from './action';
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

class Store extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {};
    }

    componentDidMount() {
        const view = this;
        const {props} = view;
        const {history, store} = props;

        if (store.isOpenFromGame === true) {
            props.setOpenFromGame(false);
            return;
        }

        console.log('store did NOT open from game, probably from url, go back');
        history.goBack();
    }

    renderUnitData(unitType: UnitTypeAllType): Node {
        const view = this;
        const {props} = view;

        return <UnitSellPosition unitType={unitType} x={props.x} y={props.y} mapState={props.map} key={unitType}/>;
    }

    renderUnitList(): Array<Node | null> {
        const view = this;

        return Object.keys(unitGuideData).map(
            (unitType: UnitTypeAllType): Node | null => view.renderUnitData(unitType)
        );
    }

    render(): Node {
        const view = this;
        const {props} = view;

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
