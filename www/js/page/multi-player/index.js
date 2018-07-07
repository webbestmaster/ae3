// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';
import buttonListWrapperStyle from './../../components/ui/button-list-wrapper/style.scss';
import Page from './../../components/ui/page';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';
import serviceStyle from './../../../css/service.scss';
import logoSrc from './../home/i/logo.png';
import homeStyle from './../home/style.scss';

class MultiPlayer extends Component<void, void> {
    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <img
                    src={logoSrc}
                    className={homeStyle.logo}
                    alt=""
                />
            </div>
        );
    }

    static renderPartButtonList(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                    <ButtonLink to={routes.createRoomOnline}>
                        {/* <Icon src="online-game"/>*/}
                        create game
                    </ButtonLink>

                    <ButtonLink to={routes.joinRoom}>
                        {/* <Icon src="online-game"/>*/}
                        join game
                    </ButtonLink>
                </ButtonListWrapper>
            </div>
        );
    }

    render(): Node {
        return (
            <Page>
                <Header>
                    Multi Player
                </Header>
                <div className={serviceStyle.two_blocks_wrapper}>
                    {MultiPlayer.renderPartLogo()}
                    {MultiPlayer.renderPartButtonList()}
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
)(MultiPlayer);
