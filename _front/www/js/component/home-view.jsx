import React, {Component, PropTypes} from 'react';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {changeLanguage} from './../actions/index';
import {Link} from 'react-router';
import Login from './login/view';
import appConst from './../const';

class HomeView extends BaseView {

    render() {

        return <div>
            <Login />
            <h1>home view</h1>
            <Link to={appConst.link.createGame}>__create_game__</Link>
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
