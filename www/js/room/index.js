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

    saveUserData() {
        const view = this;
        const color = view.refs.color.value;
        const teamId = view.refs.teamId.value;

        user.saveUserData({
            color,
            teamId
        });
    }

    render() {
        const view = this;
        const {usersData, chatMessages} = view.props.getRoomsState;

        return <div>
            <div>{view.props.getRoomsState.isInProgress ? 'in progress...' : 'done'}</div>
            <hr/>
            <div>{user.getPublicId()}</div>
            {usersData.map((userData, ii) => <div key={ii}>
                <h1>{userData.userId}</h1>
                <div>{userData.userId === user.getPublicId() ? 'you' : 'not you'}</div>

                {userData.userId === user.getPublicId() ?
                    <div>
                        <select ref="color" onChange={() => view.saveUserData(userData.userId)}
                                defaultValue={userData.color}>
                            {playerInfo.colorList.map(color => <option key={color} value={color}>{color}</option>)}
                        </select>
                        <br/>
                        <select ref="teamId" onChange={() => view.saveUserData(userData.userId)}
                                defaultValue={userData.teamId}>
                            {playerInfo.teamList.map(teamId => <option key={teamId} value={teamId}>{teamId}</option>)}
                        </select>
                    </div> :
                    <div>
                        {userData.color} - {userData.teamId}
                    </div>
                }

                <hr/>
            </div>)}
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
