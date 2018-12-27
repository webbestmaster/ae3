// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import unitInfoStyle from './unit-info.style.scss';
import type {GameDataType} from '../../model/unit/unit';
import {Unit} from '../../model/unit/unit';
import {Locale} from '../../../locale/c-locale';
import type {LangKeyType} from '../../../locale/translation/type';
import {defaultUnitData, unitGuideData} from '../../model/unit/unit-guide';
import {getUserColor} from '../../model/helper';
import {unitImageMap} from '../../../store/unit-sell-position/unit-image-map';
import levelImage from './i/level.png';
import iconUnitInfoAttack from '../../../store/unit-sell-position/i/icon-unit-info-attack.png';
import iconUnitInfoMove from '../../../store/unit-sell-position/i/icon-unit-info-move.png';
import iconUnitInfoDefence from '../../../store/unit-sell-position/i/icon-unit-info-defence.png';
import sellPositionStyle from '../../../store/unit-sell-position/style.scss';
import serviceStyle from '../../../../../css/service.scss';

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

    renderShortInfoFirstLine(): Node {
        const view = this;
        const {props} = view;
        const {unit} = props;
        const unitType = unit.attr.type;
        const unitData = unitGuideData[unitType];
        const unitLevelData = unit.getLevelData();

        return (
            <div className={sellPositionStyle.unit_sell_position__short_info__line}>
                <div className={serviceStyle.fl_l}>
                    <img
                        className={sellPositionStyle.unit_sell_position__short_info__line_icon}
                        src={levelImage}
                        alt=""
                    />
                    <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>{unitLevelData.level}</p>
                    <img
                        className={sellPositionStyle.unit_sell_position__short_info__line_icon}
                        src={iconUnitInfoAttack}
                        alt=""
                    />
                    <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>
                        {unitData.attack.min}-{unitData.attack.max}
                    </p>
                </div>
                <div className={serviceStyle.fl_l}>
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

    renderShortInfoSecondLine(): Node {
        const view = this;
        const {props} = view;
        const {unit} = props;
        const unitLevelData = unit.getLevelData();

        return (
            <div className={sellPositionStyle.unit_sell_position__short_info__line}>
                <div className={serviceStyle.clear_self}/>
                <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>
                    <span className={unitInfoStyle.hit_points_text}>HP&nbsp;</span>
                    {unit.getHitPoints()} / {defaultUnitData.hitPoints}
                </p>
                <p className={sellPositionStyle.unit_sell_position__short_info__line_text}>
                    <span className={unitInfoStyle.experience_text}>XP&nbsp;</span>
                    {unitLevelData.experience.part} / {unitLevelData.experience.size}
                </p>
            </div>
        );
    }

    renderShortInfo(): Node {
        const view = this;
        const {props} = view;
        const {unit, gameData} = props;
        const unitType = unit.attr.type;
        const unitColor = getUserColor(unit.getUserId() || '', gameData.userList) || 'gray';
        const unitImageSrc = unitImageMap[`${unitType}-${unitColor}`];

        return (
            <div className={unitInfoStyle.unit__short_info}>
                <img className={sellPositionStyle.unit_preview} src={unitImageSrc} alt=""/>

                <div className={unitInfoStyle.unit_sell_position__short_info}>
                    {view.renderShortInfoFirstLine()}
                    {view.renderShortInfoSecondLine()}
                </div>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;
        const {unit} = props;
        const unitData = unitGuideData[unit.attr.type];

        return (
            <div className={unitInfoStyle.unit__wrapper}>
                <h3 className={unitInfoStyle.unit__name}>
                    <Locale stringKey={(unitData.langKey.name: LangKeyType)}/>
                </h3>

                {view.renderShortInfo()}

                <div className={sellPositionStyle.full_info}>
                    <Locale stringKey={(unitData.langKey.description: LangKeyType)}/>
                </div>

                <div style={{display: 'none'}}>
                    <hr/>

                    {JSON.stringify(unit.attr)}

                    <hr/>
                    <hr/>

                    {'\u00A0 - &nbsp;'}
                    {'\u2026 - ...'}
                </div>
            </div>
        );
    }
}
