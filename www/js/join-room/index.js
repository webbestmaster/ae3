import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import * as userAction from './../user/action';
import api from './../user/api';
const routerConst = require('./../router/const.json');

class JoinRoomView extends BaseView {
    constructor() {
        super();

        const view = this;

        view.state = {
            rooms: []
        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        const view = this;

        api.get.room.getItems()
            .then(rawResult => view.setState({rooms: JSON.parse(rawResult)}));
    }

    joinRoom(roomId) {
        const view = this;

        view.props.setRoomId(roomId);

        api.get.room.join()
            .then(() => view.props.router.push(routerConst.link.room));
    }

    render() {
        const view = this;

        return <div>
            <h1>rooms:</h1>
            {view.state.rooms.map(roomId =>
                <button key={roomId} onClick={() => view.joinRoom(roomId)}>{roomId}</button>
            )}
            <hr/>
            <button onClick={() => view.refresh()}>refresh rooms</button>
        </div>;
    }
}

JoinRoomView.propTypes = {
    userState: PropTypes.shape({
        idState: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired,
        publicIdState: PropTypes.shape({
            publicId: PropTypes.string.isRequired
        }).isRequired,
        roomIdState: PropTypes.shape({
            roomId: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,

    setRoomId: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userState: state.userState
    }),
    {
        setRoomId: userAction.setRoomId
    }
)(JoinRoomView);
