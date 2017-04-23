import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from 'root/base/base-view';

class CreateRoom extends BaseView {

    render() {
        return <div>
            create room
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(CreateRoom);
