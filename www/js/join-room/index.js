import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';

class JoinRoom extends BaseView {

    render() {
        return <div>
            join room
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(JoinRoom);
