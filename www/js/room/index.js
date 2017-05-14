import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Proc from './../lib/proc';
import ajax from './../lib/ajax';
const apiRouteConst = require('./../api-route.json');
const mapGuide = require('./../../maps/map-guide.json');

class RoomView extends BaseView {
    sendMessage() {
        const view = this;
        const text = view.refs.chatInput.value;
        const {roomIdState, publicIdState} = view.props.userState;

        ajax.post(
            apiRouteConst.route.pushToRoomKey
                .replace(':roomId', roomIdState.roomId),
            {
                chat: {
                    publicId: publicIdState.publicId,
                    text
                }
            });
    }

    constructor() {
        super();
        this.state = {
            users: []
        };
    }

    componentWillUnmount() {
        const view = this;
        const {roomIdState, idState} = view.props.userState;
        const {pingProc, roomStatesProc} = view.state;

        pingProc.destroy();
        roomStatesProc.destroy();

        ajax.get(apiRouteConst.route.leaveRoom
            .replace(':roomId', roomIdState.roomId)
            .replace(':privateUserId', idState.id));
    }

    componentDidMount() {
        const view = this;
        const {roomIdState, idState} = view.props.userState;

        const pingProc = new Proc(() => {
            return ajax.get(apiRouteConst.route.pingUserRoom
                .replace(':roomId', roomIdState.roomId)
                .replace(':privateUserId', idState.id)
            );
        }, 1000);

        const roomStatesProc = new Proc(() => {
            return ajax.get(apiRouteConst.route.getRoomStates
                .replace(':roomId', roomIdState.roomId)
                .replace(':keys', [
                    'localization',
                    'landscape',
                    'building',
                    'unit',
                    'users',
                    'defaultMoney',
                    'unitLimit',
                    'gameName',
                    'password',
                    'chat'
                ].join(','))
            ).then(rawResult => view.setState(JSON.parse(rawResult).result));
        }, 1000);

        view.setState({pingProc, roomStatesProc});
    }

    render() {
        const view = this;
        const {state} = view;

        return <div>
            <h1>the room</h1>

            <h1>localization</h1>
            <p>{JSON.stringify(state.localization)}</p>
            <hr/>
            {state.users.map(user => <div key={user.publicId}>
                <h2>{user.publicId}</h2>
                <p>{JSON.stringify(user)}</p>
                <select defaultValue={user.team}>
                    {mapGuide.teamList.map(teamId =>
                        <option key={teamId}>{teamId}</option>
                    )}
                </select>
                <select defaultValue={user.color}>
                    {mapGuide.colorList.map(colorId =>
                        <option key={colorId}>{colorId}</option>
                    )}
                </select>
                <hr/>
            </div>)}
            <hr/>
            <p>{JSON.stringify(state.chat)}</p>

            <input ref="chatInput" type="text"/>
            <button onClick={() => view.sendMessage()}>sendMessage</button>

            <button>start game</button>
        </div>;
    }
}

RoomView.propTypes = {};

export default connect(
    state => ({
        userState: state.userState
    }),
    {}
)(RoomView);
