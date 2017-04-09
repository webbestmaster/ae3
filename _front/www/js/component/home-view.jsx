import React, {Component, PropTypes} from 'react';
import BaseView from './base/base-view';
import {connect} from 'react-redux';
import {changeLanguage} from './../action/index';
import {Link} from 'react-router';
import Login from './login/view';
import appConst from './../const';

class HomeView extends BaseView {

    render() {

        return <div>
            <Login />
            <h1>home view</h1>
            <Link to={appConst.link.createRoom}> __create_room__ </Link>
            <br/>
            <Link to={appConst.link.joinRoom}> __join_room__ </Link>
        </div>;

    }

}

HomeView.propTypes = {
    currentLanguage: PropTypes.object.isRequired,
    changeLanguageAction: PropTypes.func.isRequired
};

export default connect(
    state => ({
        currentLanguage: state.currentLanguage
    }),
    {
        changeLanguageAction: changeLanguage
    }
)(HomeView);
