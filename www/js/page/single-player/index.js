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

function SinglePlayer(): Node {
    return (
        <Page>
            <Header>
                Single Player
            </Header>
            <ButtonListWrapper>
                {/* <Button>*/}
                    select map here, like in multi player
                {/* </Button>*/}
            </ButtonListWrapper>
        </Page>
    );
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(SinglePlayer);
