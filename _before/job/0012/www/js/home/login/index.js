/* global gapi */
import React from 'react';
import PropTypes from 'prop-types';

import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import userModel from './../../model/user';
import appConst from './../../app-const.json';

import {getUserData} from './../../user-data/action';
import {initGapiClient} from './../../module/gapi/action';

import {switchLoginProgress} from './action';

import routerConst from './../../router/const.json';

import {RaisedButton} from 'material-ui';

const registerKey1 =
    '5eb3243b-c3e6-4e21-9d25-81765859cf11-375293141593-1491579076971-bed0302e-c14c-4f56-82f3-f667d8657aca';
const registerKey2 =
    '3a2acb24-78c1-44e0-9c2a-db5a219aeab5-375299806650-1491579117921-7a19e505-35c6-46b8-a395-7b5bc7d3764e';
const registerKey3 =
    'a7396f04-89f8-46cb-a110-2105d20b145a-375296022141-1492006235183-3bb8b0d7-c399-4634-aa5e-e34e53fc69dc';
const registerKey4 =
    '4786a30d-9904-46a3-a89a-818baaf21af1-375291380648-1492006400309-2dc25d7c-01a2-4f6b-aa39-80e9ff47fb5b';
const registerKey5 =
    '9bbe194a-e6d4-4bfe-ae55-fa8fe1a3cc91-375296626070-1492006539939-5da75253-8f0b-4b3c-84f0-831ad90c5967';

class Login extends BaseView {

    componentDidMount() {
        const view = this;

        view.props.initGapiClient();
    }

    login(registrationKey) {
        // When server with QR code and needed login API will be ready
        // login view will be refactored after

        const view = this;

        view.props.switchLoginProgress(true);

        loginByRegistrationKey(registrationKey)
            .then(result => {
                console.log('---- session id: ----');
                console.log(result.sessionId);

                const {sessionId} = result;

                userModel.setSessionId(sessionId);

                return view.props.getUserData(sessionId);
            })
            .then(result => {
                userModel.setPhoneNumber(result.user.phone);
                userModel.setName(result.user.userName);
                view.props.switchLoginProgress(false);
                view.props.router.push(routerConst.link.main);
            });
    }

    render() {
        const view = this;
        const {props} = view;

        return <div className="login-view">

            {props.gapiClientInitState.client ?
                <div>
                    {props.loginProgressState.isInProgress ?
                        <div>Login in progress...</div> :
                        <div>
                            <RaisedButton onClick={() => view.login(registerKey1)} label="Login Pi" />
                            <br/>
                            <br/>
                            <RaisedButton onClick={() => view.login(registerKey2)} label="Login Gggy" />
                            <br/>
                            <br/>
                            <RaisedButton onClick={() => view.login(registerKey3)} label="Login Avo" />
                            <br/>
                            <br/>
                            <RaisedButton onClick={() => view.login(registerKey4)} label="Login Bol" />
                            <br/>
                            <br/>
                            <RaisedButton onClick={() => view.login(registerKey5)} label="Login Plan" />
                        </div>
                    }
                </div> :
                <h3>client is initializing....</h3>
            }
        </div>;
    }

}

Login.propTypes = {
    gapiClientInitState: PropTypes.object.isRequired,
    loginProgressState: PropTypes.object.isRequired,

    initGapiClient: PropTypes.func.isRequired,
    switchLoginProgress: PropTypes.func.isRequired,

    router: PropTypes.object.isRequired
};

export default connect(
    state => ({
        gapiClientInitState: state.gapiState.gapiClientInitState,
        loginProgressState: state.homeState.loginState.loginProgressState
    }),
    {
        initGapiClient,
        switchLoginProgress,
        getUserData
    }
)(Login);


function loginByRegistrationKey(registrationKey) {
    return new Promise((resolve, reject) => {
        gapi.client.authorization.login({
            registrationKey
        }).execute(result => resolve(result));
    });
}
