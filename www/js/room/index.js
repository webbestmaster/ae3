import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';
import user from './../model/user';
import playerInfo from './../model/player-info.json';
import mapGuide from './../../maps/map-guide.json';
import {setRoomWatching} from './action';

class Room extends BaseView {

    componentDidMount() {
        const view = this;

        view.props.setRoomWatching(true);
        user.enterRoom();
    }

    componentWillUnmount() {
        const view = this;

        view.props.setRoomWatching(false);
    }

    render() {
        const view = this;
        const {usersData, chatMessages} = view.props.getRoomsState;

        return <div>
            <div>{view.props.getRoomsState.isInProgress ? 'in progress...' : 'done'}</div>
            {JSON.stringify(usersData)}
            <hr/>
            {JSON.stringify(playerInfo.colorList)}
            <hr/>
            {JSON.stringify(playerInfo.teamList)}
            <hr/>
            {JSON.stringify(mapGuide.settings)}
            <hr/>
            {chatMessages.map(message => <div key={JSON.stringify(message)}>{JSON.stringify(message)}</div>)}
            <input ref="text" type="text"/>
            <button onClick={() => user.sendChatMessage(view.refs.text.value)}>send message</button>
        </div>;
    }

}

Room.propTypes = {
    getRoomsState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        usersData: PropTypes.arrayOf(PropTypes.object).isRequired,
        chatMessages: PropTypes.arrayOf(PropTypes.shape({
            userId: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            timestamp: PropTypes.number.isRequired
        })).isRequired
    }).isRequired,

    setRoomWatching: PropTypes.func.isRequired
};

export default connect(
    state => ({
        getRoomsState: state.roomState.getRoomsState
    }),
    {
        setRoomWatching
    }
)(Room);
