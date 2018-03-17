// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';
import routes from '../../app/routes';

class JoinRoom extends Component<void, void> {
    render(): Node {
        return <div>
            <h1>JoinRoom</h1>
            <br/>

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
)(JoinRoom);
