// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component, Fragment} from 'react';
// import type {ContextRouterType} from '../../type/react-router-dom-v4';
import style from './style.scss';
import type {UserColorType} from '../../../../maps/map-guide';

// import commader from './i/commander/commader.png';
// import templar from './i/commander/templar.png';
import demonLord from './i/commander/demon-lord.png';
import galamar from './i/commander/galamar.png';
import saeth from './i/commander/saeth.png';
import valadorn from './i/commander/valadorn.png';
import {isNotNumber, isNumber} from '../../../../lib/is/is';
import type {LangKeyType} from '../../../locale/translation/type';
import {Locale} from '../../../locale/c-locale';

const commanderColorMap = {
    red: galamar,
    blue: valadorn,
    green: demonLord,
    black: saeth,
};

type PassedPropsType = {|
    // eslint-disable-next-line id-match
    +children: React$Node,
    +color: UserColorType,
    +money?: number,
    +onClick: () => mixed,
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        // ...$Exact<ContextRouterType>
        // +children: Node
    }>>;

type StateType = {
    // +state: number
};

export class ChangeTurnSnackBar extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            // state: 0
        };
    }

    renderIncomeMoney(): Node {
        const view = this;
        const {props, state} = view;

        if (isNotNumber(props.money)) {
            return null;
        }

        return <Locale stringKey={('INCOME': LangKeyType)} valueMap={{value: props.money}}/>;

        /*
        return (
            <div className={style.snack_bar__income_money}>
                <Locale stringKey={('INCOME': LangKeyType)} valueMap={{value: props.money}}/>
            </div>
        )
*/
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <button
                className={style.snack_bar__wrapper}
                type="button"
                onClick={props.onClick}
                onKeyPress={props.onClick}
            >
                <img className={style.snack_bar__commander_face} src={commanderColorMap[props.color]} alt=""/>

                <div className={style.snack_bar__children_wrapper}>
                    {props.children}
                    <br/>
                    {view.renderIncomeMoney()}
                </div>
            </button>
        );
    }
}
