// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';

import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';
import classnames from 'classnames';
import style from './style.scss';
import serviceStyle from './../../../css/service.scss';

import logoSrc from './i/logo.png';

class Home extends Component<void, void> {
    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <br/>
                &nbsp;&nbsp;Build of&nbsp;
                {new Date(BUILD_DATE).toLocaleString()}

                <img
                    src={logoSrc}
                    className={style.logo}
                    alt=""
                />
            </div>
        );
    }

    static renderPartButtonList(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper>
                    <ButtonLink to={routes.multiPlayer}>
                        online game
                    </ButtonLink>

                    <ButtonLink to={routes.createRoomOffline}>
                        offline game
                    </ButtonLink>

                    <Button className="disabled">
                        companies
                    </Button>

                    <Button className="disabled">
                        settings
                    </Button>
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

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Home);
