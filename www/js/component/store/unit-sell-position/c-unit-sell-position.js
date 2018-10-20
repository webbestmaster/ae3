// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../redux-store-provider/app-reducer';
import type {ContextRouterType} from '../../../type/react-router-dom-v4';
import type {UnitTypeAllType} from '../../game/model/unit/unit-guide';
import guideUnitData, {additionalUnitData} from '../../game/model/unit/unit-guide';
import {isBoolean, isNumber} from '../../../lib/is/is';
import {getSupplyState, getUserColor, isCommanderLive} from '../../game/model/helper';
import {user} from '../../../module/user';
import find from 'lodash/find';
import * as serverApi from '../../../module/server-api';
import type {MapType, MapUserType} from '../../../maps/type';
import Spinner from '../../ui/spinner/c-spinner';
import serviceStyle from '../../../../css/service.scss';
import classNames from 'classnames';
import Button from '../../ui/button/c-button';
import padStart from 'lodash/padStart';
import padEnd from 'lodash/padEnd';
import withRouter from 'react-router-dom/withRouter';
import style from './style.scss';
import type {LocaleType} from '../../locale/reducer';
import Locale, {getLocalizedString} from '../../locale/c-locale';
import type {UserColorType} from '../../../maps/map-guide';
import {imageCache} from '../../app/helper-image';
import Canvas from '../../ui/canvas/c-canvas';
import imageMap from '../../game/image/image-map';
import {icon} from '../../ui/select/icon/c-icon';

type ReduxPropsType = {|
    +locale: LocaleType
|};

type ReduxActionType = {
    // +setSmth: (smth: string) => string
};

const reduxAction: ReduxActionType = {
    // setSmth // imported from actions
};

type PassedPropsType = {|
    +unitType: UnitTypeAllType,
    +x: number,
    +y: number,
    +mapState: MapType
|};

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
        // +children: Node
    }>>;

type StateType = {|
    +mapUserData: MapUserType,
    +isInProgress: boolean,
    +isFullInfoShow: boolean
|};

class UnitSellPosition extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            mapUserData: find(props.mapState.userList, {userId: user.getId()}) || {
                userId: 'no-user-id-in-store',
                money: 0,
                teamId: 'team-0'
            },
            isInProgress: false,
            isFullInfoShow: false
        };
    }

    // eslint-disable-next-line complexity, max-statements
    getUnitCost(): number | null {
        const view = this;
        const {props, state} = view;
        const {mapUserData} = state;
        const {unitType, mapState} = props;
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
        if (isCommanderLive(user.getId(), mapState)) {
            return null;
        }

        return cost + userCommander.buyCount * additionalUnitData.additionalCommanderCost;
    }

    getUnitColor(): UserColorType | null {
        const view = this;
        const {props} = view;
        const {mapState} = props;

        return getUserColor(user.getId(), mapState.userList);
    }

    // eslint-disable-next-line max-statements
    handleOnClickBuyUnit = (): Promise<void> => {
        const view = this;
        const {props, state} = view;
        const newMap = JSON.parse(JSON.stringify(props.mapState));
        const newMapUserData = find(newMap.userList, {userId: user.getId()}) || null;
        // const newUnitData = guideUnitData[unitType];

        if (newMapUserData === null) {
            console.error('can not find map user with id', user.getId(), newMap);
            return Promise.resolve();
        }

        const unitCost = view.getUnitCost();

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
            type: props.unitType,
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
    };

    handleToggleFullInfo = () => {
        const view = this;
        const {props, state} = view;
        const {isFullInfoShow} = state;

        view.setState({isFullInfoShow: !isFullInfoShow});
    };

    // eslint-disable-next-line complexity
    render(): Node {
        const view = this;
        const {props, state} = view;
        const {unitType, locale} = props;
        const {mapUserData, isFullInfoShow, isInProgress} = state;

        console.log(imageCache);

        const unitCost = view.getUnitCost();
        const unitColor = view.getUnitColor();

        if (unitCost === null || unitColor === null) {
            console.error('can not get unit color or cost', unitCost, unitColor);
            return null;
        }

        const unitData = guideUnitData[unitType];

        const supplyState = getSupplyState(props.mapState, user.getId());

        const unitImageScr = imageMap.unit[unitType + '-' + unitColor + '-1'];

        return (
            <div key={unitType} className={style.unit_sell_position}>
                <Button
                    className={classNames(serviceStyle.ta_l, {
                        [serviceStyle.disabled]: mapUserData.money < unitCost || supplyState.isFull
                    })}
                    onClick={view.handleOnClickBuyUnit}
                >
                    {padStart(String(unitCost), 4, ' ')}
                </Button>

                <Button
                    className={classNames(serviceStyle.ta_l, {
                        [serviceStyle.disabled]: mapUserData.money < unitCost || supplyState.isFull
                    })}
                    onClick={view.handleToggleFullInfo}
                >
                    %show full info%
                </Button>

                <Canvas width={48} height={48} className={style.unit_preview} src={unitImageScr}/>

                <div>
                    {view.getUnitColor()}
                    <br/>
                    <Locale stringKey={unitData.langKey.name}/>
                    <br/>
                    &nbsp;|&nbsp; attack:
                    {unitData.attack.min}-{unitData.attack.max}
                    &nbsp;|&nbsp; move:
                    {unitData.move}
                </div>

                {isFullInfoShow ?
                    <div className={style.full_info__wrapper}>
                        {getLocalizedString(unitData.langKey.description, locale.name)}
                    </div> :
                    null}
                <Spinner isOpen={isInProgress}/>
            </div>
        );
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        locale: state.locale
    }),
    reduxAction
)(withRouter(UnitSellPosition));
