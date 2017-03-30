import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';

import {userModel} from './../../api/user-model';

class Login extends BaseView {

    constructor() {
        super();

        const view = this;

        view.addScript();

    }

    addScript() {

        const view = this;

        // TODO: try to fix it
        console.warn('onSignIn was add to global scope!!');
        window.onSignIn = googleUser => view.onSignIn(googleUser);

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';

        document.body.appendChild(script);

    }

    onSignIn(googleUser) {
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

        userModel.setTokenId(id_token);
        // userModel.setStaticId('sha1(' + profile.getEmail() + ')');

    }

    render() {

        return <div>
            <meta name="google-signin-scope" content="profile email"/>
            <meta name="google-signin-client_id"
                  content="318371264940-fm4d2matpc7kei3a0kf5rko51c3kvcot.apps.googleusercontent.com"/>
            <div className="g-signin2" data-onsuccess="onSignIn" data-theme="dark"/>

            <hr/>

        </div>;

    }

}

Login.propTypes = {};

export default connect(
    state => ({}),
    {}
)(Login);
