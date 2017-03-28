import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import api from './../../api';
// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';

class OfferGame extends BaseView {

    componentDidMount() {

        const view = this;

        const gameSetting = view.props.gameCreating.setting;

        userModel
            .setupWebSocket()
            .then(() => api.createRoom(gameSetting))
            .then(roomData => userModel.connectToRoom(roomData.roomId));

    }

    render() {

        return <div>

            <h1>__offer_game__</h1>

        </div>;

    }

}

OfferGame.propTypes = {};

export default connect(
    state => ({
        gameCreating: state.gameCreating
    }),
    {}
)(OfferGame);
