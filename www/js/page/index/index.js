// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import routes from './../../app/routes';
import Button from './../../components/ui/button';
import ButtonLink from './../../components/ui/button-link';

import uiStyle from './../../../css/ui.scss';
import serviceStyle from './../../../css/service.scss';

class Index extends Component<void, void> {
    render(): Node {
        return <div className={uiStyle.page}>
            <div className={serviceStyle.ta_c}>
                <ButtonLink
                    to={routes.multiPlayer}>
                    multi player
                </ButtonLink>

                <br/>
                <br/>
                <Button>
                    single player
                </Button>
                <br/>
                <br/>
                <Button>
                    settings
                </Button>
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
