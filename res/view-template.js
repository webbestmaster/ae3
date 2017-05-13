import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class TheView extends BaseView {
    render() {
        return <div>
            <h1>base view template</h1>
        </div>;
    }
}

TheView.propTypes = {
};

export default connect(
    state => ({}),
    {
    }
)(TheView);
