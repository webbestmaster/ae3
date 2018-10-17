// @flow

/* eslint consistent-this: ["error", "view"], react/jsx-no-bind: 0 */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import withRouter from 'react-router-dom/withRouter';
import type {ContextRouterType} from '../../../../type/react-router-dom-v4';

type PropsType = $Exact<{
    ...$Exact<ContextRouterType>
}>;

type StateType = void;

class BackButton extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <button
                type="button"
                onClick={() => {
                    props.history.goBack();
                }}
                onKeyPress={() => {
                    props.history.goBack();
                }}
                className={style.wrapper}
            >
                &lt;&lt;
            </button>
        );
    }
}

export default withRouter(BackButton);
