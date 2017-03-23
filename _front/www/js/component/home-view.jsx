import React, {Component} from 'react';
import BaseView from '../core/base-view';
import {connect} from 'react-redux';
import {changeLanguage} from '../actions/index';

class HomeView extends BaseView {

    render() {

        return <h1>home view</h1>

    }

}

export default connect(
    state => ({
        currentLanguage: state.currentLanguage
    }),
    {
        changeLanguageAction: changeLanguage
    }
)(HomeView);
