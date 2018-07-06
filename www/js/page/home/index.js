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
// import Icon from './../../components/ui/icon';
import style from './style.scss';
import serviceStyle from './../../../css/service.scss';
import Locale from './../../components/locale';
import logoSrc from './i/logo.png';
import type {LangKeyType} from './../../components/locale/translation/type';

class Home extends Component<void, void> {
    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
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
                        {/* <Icon src="online-game"/>*/}
                        <Locale stringKey={('HOME_PAGE__ONLINE_GAME': LangKeyType)}/>
                    </ButtonLink>

                    <ButtonLink to={routes.createRoomOffline}>
                        {/* <Icon src="offline-game"/>*/}
                        <Locale stringKey={('HOME_PAGE__OFFLINE_GAME': LangKeyType)}/>
                    </ButtonLink>

                    <Button className={serviceStyle.disabled}>
                        {/* <Icon src="online-game"/>*/}
                        %companies%
                    </Button>

                    <ButtonLink to={routes.settings}>
                        {/* <Icon src="online-game"/>*/}
                        <Locale stringKey={('HOME_PAGE__SETTINGS': LangKeyType)}/>
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

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Home);
