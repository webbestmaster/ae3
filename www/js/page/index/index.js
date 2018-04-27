// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';

import uiStyle from '../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';

class Index extends Component<void, void> {
    render(): Node {
        return <div className={uiStyle.page}>
            <div className={serviceStyle.ta_c}>
                <ButtonListWrapper>
                    <ButtonLink
                        to={routes.multiPlayer}>
                        multi player
                    </ButtonLink>

                    <Button className={'disabled'}>
                        single player
                    </Button>
                    <Button className={'disabled'}>
                        settings
                    </Button>
                </ButtonListWrapper>
            </div>
        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Index);
