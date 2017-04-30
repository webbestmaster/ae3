import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';

import user from './../model/user';


class Room extends BaseView {

    componentDidMount() {
        user.enterRoom().then(() => console.log('added'));
    }

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
