// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from '../../app/routes';
import Page from '../../components/ui/page/c-page';
import Button from '../../components/ui/button/c-button';
import ButtonLink from '../../components/ui/button-link/c-button-link';
import ButtonListWrapper from '../../components/ui/button-list-wrapper/c-button-list-wrapper';
import buttonListWrapperStyle from '../../components/ui/button-list-wrapper/style.scss';
import style from './style.scss';
import serviceStyle from '../../../css/service.scss';
import Locale from '../../components/locale/c-locale';
import logoSrc from './i/logo.png';
import type {LangKeyType} from '../../components/locale/translation/type';

class Home extends Component<void, void> {
    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                &nbsp;&nbsp;Build of&nbsp;
                {new Date(BUILD_DATE).toLocaleString()}
                <img src={logoSrc} className={style.logo} alt=""/>
            </div>
        );
    }

    static renderPartButtonList(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                    <ButtonLink to={routes.multiPlayer}>
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

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Home);
