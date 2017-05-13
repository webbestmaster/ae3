import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';

class HomeView extends BaseView {
    render() {
        return <div>
            Home
        </div>;
    }
}

HomeView.propTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    state => ({}),
    {}
)(HomeView);
