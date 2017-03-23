import React, {Component, PropTypes} from 'react';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {changeLanguage} from './../actions/index';
import Login from './login/view';

class HomeView extends BaseView {

    render() {

        return <div>
            <Login />
            <h1>home view</h1>
        </div>

    }

}

HomeView.propTypes = {
    changeLanguageAction: PropTypes.func.isRequired,
    currentLanguage: PropTypes.object.isRequired
};

export default connect(
    state => ({
        currentLanguage: state.currentLanguage
    }),
    {
        changeLanguageAction: changeLanguage
    }
)(HomeView);
