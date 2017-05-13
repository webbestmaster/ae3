import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';
import user from './../model/user';
import routerConst from './../router/const.json';
import {getAvailableRooms} from './action';

class JoinRoom extends BaseView {

    constructor() {
        super();

        this.state = {
            roomIds: []
        };
    }

    componentDidMount() {
        const view = this;

        view.props.getAvailableRooms();
    }

    enterRoom(id) {
        const view = this;

        user.set(user.const.roomId, id);
        user.enterRoom()
            .then(() => view.props.router.push(routerConst.route.room));
    }

    render() {
        const view = this;
        const {roomIds} = view.props.availableRoomsState;

        return <div>
            <h1>join room</h1>
            {view.props.availableRoomsState.isInProgress ?
                <div>is in progress</div> :
                roomIds.map(id => <h1 onClick={() => view.enterRoom(id)} key={id}>{id}</h1>)
            }
        </div>;
    }

}

JoinRoom.propTypes = {
    router: PropTypes.object.isRequired,
    availableRoomsState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        roomIds: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,

    getAvailableRooms: PropTypes.func.isRequired
};

export default connect(
    state => ({
        availableRoomsState: state.joinRoomState.availableRoomsState
    }),
    {
        getAvailableRooms
    }
)(JoinRoom);
