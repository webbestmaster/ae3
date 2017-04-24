/**
 * Created by dim on 23.4.17.
 */

import React from 'react';
// import PropTypes from 'prop-types';
import BaseView from 'root/base/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';

import util from 'root/util/util';

class Login extends BaseView {

    componentDidMount() {

        // TODO: try to incapsulate this
        window.onSignIn = onSignIn;
        util.loadScript('https://apis.google.com/js/platform.js');

    }

    render() {

        return <div>
            <meta name="google-signin-scope" content="profile email"/>
            <meta name="google-signin-client_id"
                  content="318371264940-fm4d2matpc7kei3a0kf5rko51c3kvcot.apps.googleusercontent.com"/>
            <div className="g-signin2" data-onsuccess="onSignIn" data-theme="dark"/>
        </div>;

    }

}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    // The ID token you need to pass to your backend:
    const id_token = googleUser.getAuthResponse().id_token;
    console.log('ID Token: ' + id_token);

}

Login.propTypes = {
    // currentLanguage: PropTypes.object.isRequired,
    // changeLanguageAction: PropTypes.func.isRequired
};

export default connect(
    state => ({
        // currentLanguage: state.currentLanguage
    }),
    {}
)(Login);
