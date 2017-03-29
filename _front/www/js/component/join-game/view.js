import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import api from './../../api';
import {Link} from 'react-router';
import appConst from './../../const';
import {showAvailableRooms} from './action';

// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';

class JoinGame extends BaseView {

    componentDidMount() {

        const view = this;

        view.props.showAvailableRooms();

    }

    joinToRoom(roomId) {

        userModel.connectToRoom(roomId);

        this.props.router.push(appConst.link.offerGame);


    }

    render() {

        const view = this;

        return <div>

            <div>{this.props.joinGame.availableRooms.isLoadingRooms}</div>
            <div>{this.props.joinGame.availableRooms.roomIds.length}</div>

            {this.props.joinGame.availableRooms.roomIds.map(roomId =>
                <button key={roomId} onClick={() => view.joinToRoom(roomId)}>__room_id__{roomId}</button>
            )}

            <h1>get available rooms</h1>

            <h1>__join_game__</h1>

            <Link to={appConst.link.offerGame}> __join_to_game__ </Link>

        </div>;

    }

}

JoinGame.propTypes = {};

export default connect(
    state => ({
        joinGame: state.joinGame
    }),
    {
        showAvailableRooms
    }
)(JoinGame);


