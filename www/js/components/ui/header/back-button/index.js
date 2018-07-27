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
            <div
                onClick={() => {
                    props.history.goBack();
                }}
                className={style.wrapper}
            >
                &lt;&lt;
            </div>
        );
    }
}

export default withRouter(BackButton);
