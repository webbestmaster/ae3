// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component, Fragment} from 'react';
import unitInfoStyle from './unit-info.style.scss';
import {Unit} from '../../model/unit/unit';
import type {GameDataType} from '../../model/unit/unit';
import {Locale} from '../../../locale/c-locale';
import type {LangKeyType} from '../../../locale/translation/type';
import {unitGuideData} from '../../model/unit/unit-guide';
import {getUserColor} from '../../model/helper';
import {unitImageMap} from '../../../store/unit-sell-position/unit-image-map';
import levelImage from './i/level.png';
import iconUnitInfoAttack from '../../../store/unit-sell-position/i/icon-unit-info-attack.png';
import iconUnitInfoMove from '../../../store/unit-sell-position/i/icon-unit-info-move.png';
import iconUnitInfoDefence from '../../../store/unit-sell-position/i/icon-unit-info-defence.png';
import sellPositionStyle from '../../../store/unit-sell-position/style.scss';

type PassedPropsType = {|
    +unit: Unit,
    +gameData: GameDataType,
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
    }>>;

type StateType = {|
    +state: number,
|};

export class UnitInfo extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            state: 0,
        };
    }

    renderLevel(): Node {
        const view = this;
        const {props, state} = view;
        const {unit, gameData} = props;

        const unitLevelData = unit.getLevelData();

        return (
            <div>
                <img src={levelImage} alt=""/>
                {JSON.stringify(unitLevelData)}
            </div>
        );
    }

    renderShortInfo(): Node {
        const view = this;
        const {props, state} = view;
        const {unit} = props;
        const unitType = unit.attr.type;

        const unitData = unitGuideData[unitType];

        return (
            <div className={sellPositionStyle.unit_sell_position__short_info}>
                <div className={sellPositionStyle.unit_sell_position__short_info__line}>
                    <img
                        className={sellPositionStyle.unit_sell_position__short_info__line_icon}
                        src={iconUnitInfoAttack}
                        alt=""
                    />
                    <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>
                        {unitData.attack.min}-{unitData.attack.max}
                    </p>
                </div>
                <div className={sellPositionStyle.unit_sell_position__short_info__line}>
                    <img
                        className={sellPositionStyle.unit_sell_position__short_info__line_icon}
                        src={iconUnitInfoMove}
                        alt=""
                    />
                    <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>{unitData.move}</p>
                    <img
                        className={sellPositionStyle.unit_sell_position__short_info__line_icon}
                        src={iconUnitInfoDefence}
                        alt=""
                    />
                    <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>{unitData.armor}</p>
                </div>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;
        const {unit, gameData} = props;
        const unitData = unitGuideData[unit.attr.type];

        const unitColor = getUserColor(unit.getUserId() || '', gameData.userList) || 'gray';

        const unitImageSrc = unitImageMap[`${unit.attr.type}-${unitColor}`];

        return (
            <div>
                <h1>
                    <Locale stringKey={(unitData.langKey.name: LangKeyType)}/>
                </h1>

                <img className={sellPositionStyle.unit_preview} src={unitImageSrc} alt=""/>

                {view.renderLevel()}

                <hr/>

                {view.renderShortInfo()}

                <hr/>

                {JSON.stringify(unit.attr)}

                <hr/>
                <hr/>

                {'\u00A0 - &nbsp;'}
                {'\u2026 - ...'}
            </div>
        );
    }
}
