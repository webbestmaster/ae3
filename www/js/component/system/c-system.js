// @flow

/* global window, document */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {OnResizeType} from './action';
import {onResize} from './action';
import type {GlobalStateType} from '../../redux-store-provider/reducer';
import type {SystemType} from './reducer/root';
import classNames from 'classnames';
import style from './style.css';
import {screenNameReference} from './reducer/screen';
import type {LocaleType} from '../locale/reducer';
import {localeNameReference} from '../locale/const';
import {setIsGlobalScrollEnable} from './helper';

type ReduxPropsType = {|
    +system: SystemType,
    +locale: LocaleType,
|};

type ReduxActionType = {|
    +onResize: (width: number, height: number) => OnResizeType,
|};

const reduxAction: ReduxActionType = {
    onResize, // imported from actions
};

type PassedPropsType = {|
    children: Node,
    // +passedProp: string
|};

type PropsType = $Exact<{
    ...$Exact<PassedPropsType>,
    ...$Exact<ReduxPropsType>,
    ...$Exact<ReduxActionType>,
    +children: Node,
}>;

type StateType = null;

class System extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = null;
    }

    componentDidMount() {
        const view = this;
        const {props, state} = view;

        window.addEventListener(
            'resize',
            () => {
                const {clientWidth, clientHeight} = document.documentElement || {clientWidth: 800, clientHeight: 600};

                props.onResize(clientWidth, clientHeight);
            },
            false
        );
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        const view = this;
        const {props, state} = view;

        if (props.system.scroll.isEnable !== prevProps.system.scroll.isEnable) {
            setIsGlobalScrollEnable(props.system.scroll.isEnable);
        }
    }

    getClassName(): string {
        const view = this;
        const {props, state} = view;

        const screenProps = props.system.screen;
        const littleThenList = screenProps.littleThen;
        const localeName = props.locale.name;

        return classNames({
            [style.landscape]: screenProps.isLandscape,
            [style.portrait]: screenProps.isPortrait,
            [style.desktop]: screenProps.isDesktop,
            [style.tablet]: screenProps.isTablet,
            [style.mobile]: screenProps.isMobile,
            [style.lt_desktop_width]: littleThenList.includes(screenNameReference.desktop),
            [style.lt_tablet_width]: littleThenList.includes(screenNameReference.tablet),
            [style.locale__en_us]: localeName === localeNameReference.enUs,
            [style.locale__ru_ru]: localeName === localeNameReference.ruRu,
            [style.locale__zh_ch]: localeName === localeNameReference.zhCn,
            [style.locale__zh_tw]: localeName === localeNameReference.zhTw,
        });
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div className={view.getClassName()}>{props.children}</div>;
    }
}

const ConnectedComponent = connect<ComponentType<System>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        system: state.system,
        locale: state.locale,
    }),
    reduxAction
)(System);

export {ConnectedComponent as System};
