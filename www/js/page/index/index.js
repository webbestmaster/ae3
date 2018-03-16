// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';

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
                <div className={uiStyle.button}>button</div>
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
