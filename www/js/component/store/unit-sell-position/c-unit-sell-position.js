// @flow

/* global window, Event */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../redux-store-provider/reducer';
import type {ContextRouterType} from '../../../type/react-router-dom-v4';
import type {UnitTypeAllType} from '../../game/model/unit/unit-guide';
import {additionalUnitData, unitGuideData} from '../../game/model/unit/unit-guide';
import {isNumber} from '../../../lib/is/is';
import {getSupplyState, getUserColor, isCommanderLive} from '../../game/model/helper';
import find from 'lodash/find';
import * as serverApi from '../../../module/server-api';
import type {MapType, MapUserType} from '../../../maps/type';
import {Spinner} from '../../ui/spinner/c-spinner';
import serviceStyle from '../../../../css/service.scss';
import classNames from 'classnames';
import {Button} from '../../ui/button/c-button';
import withRouter from 'react-router-dom/withRouter';
import style from './style.scss';
import type {LocaleType} from '../../locale/reducer';
import {Locale} from '../../locale/c-locale';
import type {UserColorType} from '../../../maps/map-guide';
import {mapGuide} from '../../../maps/map-guide';
import iconUnitInfoAttack from './i/icon-unit-info-attack.png';
import iconUnitInfoMove from './i/icon-unit-info-move.png';
import iconUnitInfoDefence from './i/icon-unit-info-defence.png';
import iconUnitInfoDescription from './i/icon-unit-info-description.png';
import iconUnitInfoDescriptionOpen from './i/icon-unit-info-description-open.png';
import {messageConst} from '../../../lib/local-server/room/message-const';
import {unitImageMap} from './unit-image-map';
import type {LangKeyType} from '../../locale/translation/type';

type ReduxPropsType = {|
    +locale: LocaleType,
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
    +mapState: MapType,
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
        +match: {
            +params: {
                +roomId: string,
            },
        },
        // +children: Node
    }>>;

type StateType = {|
    +mapUserData: MapUserType,
    +isInProgress: boolean,
    +isFullInfoShow: boolean,
|};

class UnitSellPosition extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            mapUserData: find(props.mapState.userList, {userId: props.mapState.activeUserId}) || {
                userId: 'no-user-id-in-store',
                money: 0,
                teamId: mapGuide.teamIdList[0],
                isLeaved: false,
            },
            isInProgress: false,
            isFullInfoShow: false,
        };
    }

    // eslint-disable-next-line complexity, max-statements
    getUnitCost(): number | null {
        const view = this;
        const {props, state} = view;
        const {mapUserData} = state;
        const {unitType, mapState} = props;
        const unitData = unitGuideData[unitType];

        if (unitData.canBeBuy === false) {
            return null;
        }

        const cost = isNumber(unitData.cost) ? unitData.cost : null;

        if (cost === null) {
            console.error('unit canBeBuy but without cost');
            return null;
        }

        if (!view.isCommander()) {
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
        if (isCommanderLive(mapState.activeUserId, mapState)) {
            return null;
        }

        return cost + userCommander.buyCount * additionalUnitData.additionalCommanderCost;
    }

    isCommander(): boolean {
        const view = this;
        const {props} = view;
        const {unitType} = props;
        const unitData = unitGuideData[unitType];

        return unitData.isCommander;
    }

    getUnitColor(): UserColorType | null {
        const view = this;
        const {props} = view;
        const {mapState} = props;

        return getUserColor(mapState.activeUserId, mapState.userList);
    }

    // eslint-disable-next-line complexity, max-statements
    handleOnClickBuyUnit = (): Promise<void> => {
        const view = this;
        const {props} = view;
        const {mapState} = props;
        const newMap = JSON.parse(JSON.stringify(mapState));
        const newMapUserData = find(newMap.userList, {userId: mapState.activeUserId}) || null;
        // const newUnitData = unitGuideData[unitType];

        if (newMapUserData === null) {
            console.error('can not find map user with id', mapState.activeUserId, newMap);
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

        if (view.isCommander()) {
            newMapUserData.commander.buyCount += 1;
        }

        const newMapUnitData = {
            type: props.unitType,
            x: props.x,
            y: props.y,
            userId: mapState.activeUserId,
            id: [props.x, props.y, Math.random()].join('-'),
        };

        newMap.units.push(newMapUnitData);

        view.setState({isInProgress: true});

        return serverApi
            .pushState(props.match.params.roomId, mapState.activeUserId, {
                type: messageConst.type.pushState,
                state: {
                    type: 'buy-unit',
                    newMapUnit: newMapUnitData,
                    map: newMap,
                    activeUserId: mapState.activeUserId,
                },
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
        const {state} = view;
        const {isFullInfoShow} = state;

        view.setState({isFullInfoShow: !isFullInfoShow}, () => {
            window.dispatchEvent(new Event('resize'));
        });
    };

    renderShortInfo(): Node {
        const view = this;
        const {props, state} = view;
        const {unitType} = props;
        const {isFullInfoShow} = state;

        const unitData = unitGuideData[unitType];

        return (
            <div className={style.unit_sell_position__short_info}>
                <Button className={style.show_info_button} onClick={view.handleToggleFullInfo}>
                    <img
                        className={style.show_info_description_icon}
                        src={isFullInfoShow ? iconUnitInfoDescriptionOpen : iconUnitInfoDescription}
                        alt=""
                    />
                </Button>
                <div className={style.unit_sell_position__short_info__line}>
                    <img className={style.unit_sell_position__short_info__line_icon} src={iconUnitInfoAttack} alt=""/>
                    <p className={style.unit_sell_position__short_info__line_text}>
                        {unitData.attack.min}-{unitData.attack.max}
                    </p>
                </div>
                <div className={style.unit_sell_position__short_info__line}>
                    <img className={style.unit_sell_position__short_info__line_icon} src={iconUnitInfoMove} alt=""/>
                    <p className={style.unit_sell_position__short_info__line_text}>{unitData.move}</p>
                    <img className={style.unit_sell_position__short_info__line_icon} src={iconUnitInfoDefence} alt=""/>
                    <p className={style.unit_sell_position__short_info__line_text}>{unitData.armor}</p>
                </div>
            </div>
        );
    }

    // eslint-disable-next-line complexity
    render(): Node {
        const view = this;
        const {props, state} = view;
        const {unitType, locale} = props;
        const {mapUserData, isFullInfoShow, isInProgress} = state;

        const unitCost = view.getUnitCost();
        const unitColor = view.getUnitColor();

        if (unitCost === null || unitColor === null) {
            console.error('can not get unit color or cost', unitCost, unitColor);
            return null;
        }

        const unitData = unitGuideData[unitType];

        const supplyState = getSupplyState(props.mapState, props.mapState.activeUserId);

        return (
            <div key={unitType} className={style.unit_sell_position}>
                <h3 className={style.unit_name}>
                    <Locale stringKey={unitData.langKey.name}/>
                </h3>

                <div className={style.unit_data}>
                    <img className={style.unit_preview} src={unitImageMap[`${unitType}-${unitColor}`]} alt=""/>

                    <Button
                        className={classNames(style.buy_button, {
                            [serviceStyle.disabled]: mapUserData.money < unitCost || supplyState.isFull,
                        })}
                        onClick={view.handleOnClickBuyUnit}
                    >
                        ${unitCost}
                    </Button>

                    {view.renderShortInfo()}

                    {isFullInfoShow ?
                        <div className={style.full_info}>
                            <Locale stringKey={(unitData.langKey.description: LangKeyType)}/>
                        </div> :
                        null}
                </div>
                <Spinner isOpen={isInProgress}/>
            </div>
        );
    }
}

const ConnectedComponent = connect<ComponentType<UnitSellPosition>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        locale: state.locale,
    }),
    reduxAction
)(withRouter(UnitSellPosition));

export {ConnectedComponent as UnitSellPosition};
