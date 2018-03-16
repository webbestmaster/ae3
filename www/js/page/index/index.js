// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';

class Index extends Component<void, void> {
    render(): Node {
        return <h1>Index</h1>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Index);
