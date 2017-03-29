import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import api from './../../api';
import {Link} from 'react-router';
import appConst from './../../const';
import {updateAvailableRooms} from './action';

// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';

class JoinRoom extends BaseView {

    componentDidMount() {

        const view = this;

        view.props.updateAvailableRooms();

    }

    joinToRoom(roomId) {

        userModel.connectToRoom(roomId).then(() => {
            console.log('connected to room');
        });

        this.props.router.push(appConst.link.openRoom);

    }

    render() {

        const view = this;

        return <div>

            <div>{this.props.joinRoom.availableRooms.isLoaded}</div>
            <div>{this.props.joinRoom.availableRooms.roomIds.length}</div>

            {this.props.joinRoom.availableRooms.roomIds.map(roomId =>
                <button key={roomId} onClick={() => view.joinToRoom(roomId)}>__room_id__{roomId}</button>
            )}

            <h1>get available rooms</h1>

            <h1>__join_game__</h1>

        </div>;

    }

}

JoinRoom.propTypes = {};

export default connect(
    state => ({
        joinRoom: state.joinRoom
    }),
    {
        updateAvailableRooms
    }
)(JoinRoom);


