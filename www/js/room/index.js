/* global setTimeout, clearTimeout */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';
import user from './../model/user';
import playerInfo from './../model/player-info.json';
import mapGuide from './../../maps/map-guide.json';

class Room extends BaseView {

    constructor() {
        super();

        this.state = {
            usersData: [],
            chatMessages: [],
            isRoomWatching: false,
            timeoutId: 0
        };
    }

    componentDidMount() {
        const view = this;

        user.enterRoom().then(() => view.setRoomWatching(true));
    }

    componentWillUnmount() {
        const view = this;

        clearTimeout(view.state.timeoutId);
        view.setRoomWatching(false);
    }

    setRoomWatching(isEnable) {
        const view = this;
        const currentState = view.state.isRoomWatching;

        if (currentState === isEnable) {
            return false;
        }

        view.setState({isRoomWatching: isEnable});

        if (!isEnable) {
            return true;
        }

        (function watching() {
            if (!view.state.isRoomWatching) {
                return;
            }

            user.getRoomState()
                .then(roomState => view.setState({
                    usersData: roomState.usersData,
                    chatMessages: roomState.chatMessages,
                    timeoutId: setTimeout(watching, 1e3)
                }));
        }());

        return true;
    }

    render() {
        const view = this;

        return <div>
            {JSON.stringify(view.state.usersData)}
            <hr/>
            {JSON.stringify(playerInfo.colorList)}
            <hr/>
            {JSON.stringify(playerInfo.teamList)}
            <hr/>
            {JSON.stringify(mapGuide.settings)}
            <hr/>
            {view.state.chatMessages.map(message => <div key={JSON.stringify(message)}>{JSON.stringify(message)}</div>)}
            <input ref="text" type="text"/>
            <button onClick={() => user.sendChatMessage(view.refs.text.value)}>send message</button>
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(Room);
