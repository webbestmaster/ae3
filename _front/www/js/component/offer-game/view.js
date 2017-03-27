import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import api from './../../api';
// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';

class OfferGame extends BaseView {

    componentDidMount() {

        const view = this;

        const gameSetting = view.props.gameCreating.setting;

        api.createRoom(gameSetting).then(gameData => {
            // TODO: here is end of current work
            // gameData.roomId - is id of new room
            debugger
            return api.connectToOfferGame(gameData.id);
        });

    }

    render() {

        return <div>

            <h1>__offer_game__</h1>

        </div>

    }

}

OfferGame.propTypes = {};

export default connect(
    state => ({
        gameCreating: state.gameCreating
    }),
    {}
)(OfferGame);
