// @flow

/* eslint consistent-this: ["error", "view"] */

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

    handleOnClickGoBack = () => {
        const view = this;
        const {props} = view;

        props.history.goBack();
    };

    render(): Node {
        const view = this;

        return (
            <button
                type="button"
                onClick={view.handleOnClickGoBack}
                onKeyPress={view.handleOnClickGoBack}
                className={style.wrapper}
            >
                &lt;&lt;
            </button>
        );
    }
}

const ConnectedComponent = withRouter(BackButton);

export {ConnectedComponent as BackButton};
