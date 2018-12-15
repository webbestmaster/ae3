// @flow

/* global BUILD_DATE_H, BRANCH_NAME */

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {routes} from '../../component/app/routes';
import {Page} from '../../component/ui/page/c-page';
import {Button} from '../../component/ui/button/c-button';
import {ButtonLink} from '../../component/ui/button-link/c-button-link';
import {ButtonListWrapper} from '../../component/ui/button-list-wrapper/c-button-list-wrapper';
import buttonListWrapperStyle from '../../component/ui/button-list-wrapper/style.scss';
import style from './style.scss';
import serviceStyle from '../../../css/service.scss';
import {Locale} from '../../component/locale/c-locale';
import logoSrc from './i/logo.png';
import type {LangKeyType} from '../../component/locale/translation/type';
import type {ContextRouterType} from '../../type/react-router-dom-v4';

type ReduxPropsType = {};

type ReduxActionType = {};

const reduxAction: ReduxActionType = {};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
    }>>;

type StateType = null;

class Home extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                &nbsp;&nbsp;Build of&nbsp;
                {String(BUILD_DATE_H)}
                <br/>
                &nbsp;&nbsp;Branch:&nbsp;
                {String(BRANCH_NAME)}
                <img src={logoSrc} className={style.logo} alt=""/>
            </div>
        );
    }

    static renderPartButtonList(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                    <ButtonLink to={routes.multiPlayer} className={serviceStyle.disabled}>
                        <Locale stringKey={('ONLINE_GAME': LangKeyType)}/>
                    </ButtonLink>

                    <ButtonLink to={routes.createRoomOffline}>
                        <Locale stringKey={('OFFLINE_GAME': LangKeyType)}/>
                    </ButtonLink>

                    <Button className={serviceStyle.disabled}>%companies%</Button>

                    <ButtonLink to={routes.settings}>
                        <Locale stringKey={('SETTINGS': LangKeyType)}/>
                    </ButtonLink>
                </ButtonListWrapper>
            </div>
        );
    }

    render(): Node {
        return (
            <Page>
                <div className={serviceStyle.two_blocks_wrapper}>
                    {Home.renderPartLogo()}
                    {Home.renderPartButtonList()}
                </div>
            </Page>
        );
    }
}

const ConnectedComponent = connect<ComponentType<Home>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: {}): ReduxPropsType => ({
        // app: state.app
    }),
    reduxAction
)(Home);

export {ConnectedComponent as Home};
