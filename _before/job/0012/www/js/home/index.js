import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import Login from './login/';

class HomeView extends BaseView {

    render() {
        const view = this;

        return <div>
            <Login router={view.props.router}/>
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
