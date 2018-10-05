// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import routes from '../../app/routes';
import buttonListWrapperStyle from '../../components/ui/button-list-wrapper/style.scss';
import Page from '../../components/ui/page/c-page';
import ButtonLink from '../../components/ui/button-link/c-button-link';
import ButtonListWrapper from '../../components/ui/button-list-wrapper/c-button-list-wrapper';
import Header from '../../components/ui/header/c-header';
import serviceStyle from '../../../css/service.scss';
import logoSrc from '../home/i/logo.png';
import homeStyle from '../home/style.scss';
import type {LangKeyType} from '../../components/locale/translation/type';
import Locale from '../../components/locale/c-locale';

export default class MultiPlayer extends Component<void, void> {
    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <img src={logoSrc} className={homeStyle.logo} alt=""/>
            </div>
        );
    }

    static renderPartButtonList(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                    <ButtonLink to={routes.createRoomOnline}>
                        <Locale stringKey={('CREATE_GAME': LangKeyType)}/>
                    </ButtonLink>

                    <ButtonLink to={routes.joinRoom}>
                        <Locale stringKey={('JOIN_GAME': LangKeyType)}/>
                    </ButtonLink>
                </ButtonListWrapper>
            </div>
        );
    }

    render(): Node {
        return (
            <Page>
                <Header>
                    <Locale stringKey={('ONLINE_GAME': LangKeyType)}/>
                </Header>
                <div className={serviceStyle.two_blocks_wrapper}>
                    {MultiPlayer.renderPartLogo()}
                    {MultiPlayer.renderPartButtonList()}
                </div>
            </Page>
        );
    }
}
