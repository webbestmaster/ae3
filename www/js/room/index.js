import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';

class Room extends BaseView {

    render() {
        return <div>
            I am room
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(Room);
