// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from './../../../../app-reducer';
import style from './style.scss';
import withRouter from 'react-router-dom/withRouter';
import type {ContextRouter} from 'react-router-dom';

type PropsType = {|
    ...ContextRouter
|};

type StateType = void;

export class BackButton extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <div
                onClick={() => {
                    props.history.go(-1);
                }}
                className={style.wrapper}
            >
                &lt;&lt;
            </div>
        );
    }
}

export default withRouter(connect(
    (state: GlobalStateType): {} => ({
        // auth: state.auth
    }),
    {
        // setUser
    }
)(BackButton));
