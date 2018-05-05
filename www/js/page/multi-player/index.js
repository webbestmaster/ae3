// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';

import Page from './../../components/ui/page';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';

class MultiPlayer extends Component<void, void> {
    render(): Node {
        return <Page>
            <Header>Multi Player</Header>
            <ButtonListWrapper>
                <ButtonLink
                    to={routes.createRoom}>
                    create game
                </ButtonLink>

                <ButtonLink
                    to={routes.joinRoom}>
                    join game
                </ButtonLink>
            </ButtonListWrapper>
        </Page>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(MultiPlayer);
