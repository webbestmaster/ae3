// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import routes from './../../app/routes';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';

class Index extends Component<void, void> {
    render(): Node {
        return <div>
            <h1>Index</h1>
            <br/>
            <br/>
            <br/>
            <div className={serviceStyle.ta_c}>
                <Link
                    to={routes.multiPlayer}
                    className={uiStyle.button}>
                    multi player
                </Link>
                <br/>
                <br/>
                <div className={uiStyle.button}>single player</div>
                <br/>
                <br/>
                <div className={uiStyle.button}>settings</div>
                <br/>
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
