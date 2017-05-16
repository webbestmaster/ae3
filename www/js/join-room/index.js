import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Proc from './../lib/proc';
import ajax from './../lib/ajax';
import * as userAction from './../user/action';
const apiRouteConst = require('./../api-route.json');
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

        ajax.get(apiRouteConst.route.getRooms)
            .then(rawResult => {
                view.setState({rooms: JSON.parse(rawResult)});
            });
    }

    joinRoom(roomId) {
        const view = this;
        const userId = view.props.userState.idState.id;

        view.props.setRoomId(roomId);

        ajax.get(apiRouteConst.route.joinRoom
            .replace(':roomId', roomId)
            .replace(':privateUserId', userId)
        ).then(() => {
            view.props.router.push(routerConst.link.room);
        });
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

JoinRoomView.propTypes = {};

export default connect(
    state => ({
        userState: state.userState
    }),
    {
        setRoomId: userAction.setRoomId
    }
)(JoinRoomView);
