import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BaseView from '../base/base-view';
import {connect} from 'react-redux';
// import api from './../../api';
// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';
import Chat from './../chat/view';

class OpenRoom extends BaseView {

    componentWillMount() {

        const view = this;

        view.props.router.setRouteLeaveHook(
            view.props.route,
            () => userModel.destroyWebSocket()
        );

    }

    startGame() {

        console.log('start game!!!');

    }

    render() {

        const view = this;

        return <div>

            <h1>__open_room__</h1>

            <h2>here is a list of connection, players and etc...</h2>

            <Chat />

            <hr/>
            <button onClick={() => view.startGame()}>start game</button>

        </div>;

    }

}

OpenRoom.propTypes = {
    gameCreating: PropTypes.object.isRequired
};

export default connect(
    state => ({
        gameCreating: state.gameCreating
    }),
    {}
)(OpenRoom);