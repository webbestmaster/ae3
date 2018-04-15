// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import routes from './../../app/routes';

class MultiPlayer extends Component<void, void> {
    render(): Node {
        return <div>
            <h1>MultiPlayer</h1>
            <br/>
            <div className={serviceStyle.ta_c}>
                <Link
                    to={routes.createRoom}
                    className={uiStyle.button}>
                    create game
                </Link>
                <br/>
                <br/>
                <Link
                    to={routes.joinRoom}
                    className={uiStyle.button}>
                    join game
                </Link>
                <br/>
                <br/>
            </div>

            <br/>
            <br/>
        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(MultiPlayer);
