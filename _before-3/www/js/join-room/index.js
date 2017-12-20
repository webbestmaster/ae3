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
            .then(rooms => view.setState({rooms}));
    }

    joinRoom(instanceId) {
        const view = this;

        view.props.setRoomId(instanceId);

        api.get.room.join()
            .then(() => view.props.router.push(routerConst.link.room));
    }

    render() {
        const view = this;

        return <div>
            <h1>rooms:</h1>
            {view.state.rooms.map(instanceId =>
                <button key={instanceId} onClick={() => view.joinRoom(instanceId)}>{instanceId}</button>
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
            instanceId: PropTypes.string.isRequired
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
