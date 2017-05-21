import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
// import Proc from './../../lib/proc';
// import ajax from './../lib/ajax';
// import _ from 'lodash';
// import timer from './../../lib/timer';
// import find from 'lodash/find';
import * as gameAction from './../game/action';
import api from './../user/api';
const mapGuide = require('./../../maps/map-guide.json');

class SettingView extends BaseView {
    sendMessage() {
        const view = this;

        api.post.room.pushToKey(null, {
            chat: {
                publicId: view.props.userState.publicIdState.publicId,
                text: view.refs.chatInput.value
            }
        });
    }

    setUserProperty(key, value) {
        return api.post.room.setUserState(null, {[key]: value});
    }

    setRoomState(key, value) {
        return api.post.room.setState(null, {[key]: value});
    }

    componentWillReceiveProps(nextProps) {
        const view = this;

        if (nextProps.gameState.state.isTimerStarted &&
            nextProps.gameState.state.isTimerStarted !== view.props.gameState.state.isTimerStarted) {
            view.props.startTimer();
        }
    }

    componentDidMount() {
        const view = this;

        view.setUserProperty('color', view.refs.colorSelect.value);
        view.setUserProperty('team', view.refs.teamSelect.value);

        if (view.refs.defaultMoney) {
            view.setRoomState('defaultMoney', view.refs.defaultMoney.value);
            view.setRoomState('unitLimit', view.refs.unitLimit.value);
        }
    }

    startGame() {
        const view = this;

        view.setRoomState('isTimerStarted', true);
    }

    render() {
        const view = this;
        const userPublicId = view.props.userState.publicIdState.publicId;
        const {
            users, isTimerStarted, localization, defaultMoney, unitLimit, chat, startGameTimer
        } = view.props.gameState.state;
        const zeroUserPublicId = users[0] ? users[0].publicId : null;

        return <div>
            <h1>settings</h1>
            <h1>startGameTimer: {startGameTimer}</h1>

            <h1>localization</h1>
            <p>{JSON.stringify(localization)}</p>
            <hr/>
            <h1>users part</h1>
            {users.map(user => <div key={user.publicId}>
                <h2>{user.publicId}</h2>
                <p>{JSON.stringify(user)}</p>
                {userPublicId === user.publicId && startGameTimer > 4 ?
                    <div>
                        <select
                            ref="teamSelect"
                            onChange={evt => view.setUserProperty('team', evt.currentTarget.value)}
                            defaultValue={user.team}>
                            {mapGuide.teamList.map(teamId =>
                                <option key={teamId}>{teamId}</option>
                            )}
                        </select>
                        <select
                            ref="colorSelect"
                            onChange={evt => view.setUserProperty('color', evt.currentTarget.value)}
                            defaultValue={user.color}>
                            {mapGuide.colorList.map(colorId =>
                                <option key={colorId}>{colorId}</option>
                            )}
                        </select>
                    </div> :
                    <div>
                        {user.color}, {user.team}
                    </div>
                }
                <hr/>
            </div>)}
            <hr/>

            {zeroUserPublicId === userPublicId ?
                <div>
                    <h1>money limit</h1>
                    <select ref="defaultMoney"
                            onChange={evt => view.setRoomState('defaultMoney', evt.currentTarget.value)}>
                        {mapGuide.defaultMoneyList.map(money =>
                            <option key={money} value={money}>{money}</option>
                        )}
                    </select>
                    <h1>unit limit</h1>
                    <select ref="unitLimit"
                            onChange={evt => view.setRoomState('unitLimit', evt.currentTarget.value)}>
                        {mapGuide.unitLimitList.map(limit =>
                            <option key={limit} value={limit}>{limit}</option>
                        )}
                    </select>
                    <hr/>
                </div> :
                <div>
                    <h1>unit defaultMoney: {defaultMoney}</h1>
                    <h1>unit limit: {unitLimit}</h1>
                </div>
            }
            <hr/>
            <p>{JSON.stringify(chat)}</p>

            <input ref="chatInput" type="text"/>
            <button onClick={() => view.sendMessage()}>sendMessage</button>

            {zeroUserPublicId !== userPublicId || isTimerStarted ?
                <button>disabled start game</button> :
                <button onClick={() => view.startGame()}>
                    start game
                </button>
            }
        </div>;
    }
}

SettingView.propTypes = {
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
    gameState: PropTypes.object.isRequired,

    setGameState: PropTypes.func.isRequired,
    resetGameState: PropTypes.func.isRequired,
    startTimer: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userState: state.userState,
        gameState: state.gameState
    }),
    {
        setGameState: gameAction.setState,
        resetGameState: gameAction.resetState,
        startTimer: gameAction.startTimer
    }
)(SettingView);
