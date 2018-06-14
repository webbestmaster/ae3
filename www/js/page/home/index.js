// @flow

import type {Node} from 'react';
import React from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';

import Page from './../../components/ui/page';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import Header from './../../components/ui/header';

function Home(): Node {
    return (
        <Page>
            <Header>
                Home
            </Header>
            <ButtonListWrapper>
                <ButtonLink
                    to={routes.multiPlayer}
                >
                    multi player
                </ButtonLink>

                <Button className="disabled">
                    single player
                </Button>

                <Button className="disabled">
                    settings
                </Button>
            </ButtonListWrapper>
        </Page>
    );
}

/*
class Index extends Component<void, void> {
    render(): Node {
    }
}
*/

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Home);
