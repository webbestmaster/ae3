import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import api from './../../api';
import {Link} from 'react-router';
import appConst from './../../const';

// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';

class JoinGame extends BaseView {

    componentDidMount() {

        api.getAvailableRooms().then(roomIds => {
            console.warn('rooms id is here');



            userModel.connectToRoom(roomIds[0]);

        });



    }

    render() {

        return <div>



            <h1>get available rooms</h1>
            <h1>__join_game__</h1>

            <Link to={appConst.link.offerGame}> __join_to_game__ </Link>

        </div>;

    }

}

JoinGame.propTypes = {};

export default connect(
    state => ({
        // gameCreating: state.gameCreating
    }),
    {}
)(JoinGame);


