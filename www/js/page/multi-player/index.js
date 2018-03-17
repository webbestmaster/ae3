// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';

import uiStyle from './../../components/ui/ui.scss';
import serviceStyle from './../../../css/service.scss';

class MultiPlayer extends Component<void, void> {
    render(): Node {
        return <div>
            <h1>MultiPlayer</h1>
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
)(MultiPlayer);
