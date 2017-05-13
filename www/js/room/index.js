import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class RoomView extends BaseView {
    render() {
        return <div>
            <h1>the room</h1>
        </div>;
    }
}

RoomView.propTypes = {
};

export default connect(
    state => ({}),
    {
    }
)(RoomView);
