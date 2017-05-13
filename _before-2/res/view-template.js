import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from 'root/base/base-view';

class VIEW extends BaseView {

    render() {
        return <div>
            template
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(VIEW);
