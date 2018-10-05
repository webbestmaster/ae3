// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import withRouter from 'react-router-dom/withRouter';
import type {ContextRouter} from 'react-router-dom';

type PropsType = {|
    ...ContextRouter
|};

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
