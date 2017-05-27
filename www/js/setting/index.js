import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
// import Proc from './../../lib/proc';
// import ajax from './../lib/ajax';
import {isEqual} from 'lodash';
// import timer from './../../lib/timer';
// import find from 'lodash/find';
import isItMe from './../lib/is-it-me';
import * as gameAction from './../game/action';
import api from './../user/api';
import Proc from './../lib/proc';
const mapGuide = require('./../../maps/map-guide.json');

const getDefaultState = () => ({
    roomStatesProc: null
});

class SettingView extends BaseView {
    constructor() {
        super();
        this.state = getDefaultState();
    }

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
        const currentTimer = view.props.gameState.state.isTimerStarted;
        const nextTimer = nextProps.gameState.state.isTimerStarted;

        if (nextTimer && nextTimer !== currentTimer) {
            view.props.startTimer();
        }
    }

    getMainGameData() {
        const view = this;

        return api.get.room
            .getStates({
                keys: [
                    'localization',
                    'landscape',
                    'buildings',
                    'units',
                    'gameName',
                    'password'
                ].join(',')
            })
            .then(({result}) => view.props.setGameState(result));
    }

    componentDidMount() {
        const view = this;

        // FIXME
        view.setUserProperty('color', 'red');
        view.setUserProperty('team', 'team-1');
        // view.setUserProperty('color', view.refs.colorSelect.value);
        // view.setUserProperty('team', view.refs.teamSelect.value);

        // FIXME TOO
        if (view.refs.defaultMoney) {
            view.setRoomState('defaultMoney', view.refs.defaultMoney.value);
            view.setRoomState('unitLimit', view.refs.unitLimit.value);
        }

        view.getMainGameData();

        let previousState = {};

        view.state.roomStatesProc = new Proc(() => {
            return api.get.room
                .getStates({
                    keys: [
                        // 'localization',
                        // 'landscape',
                        // 'buildings',
                        // 'units',
                        'users',
                        'defaultMoney',
                        'unitLimit',
                        // 'gameName',
                        // 'password',
                        'chat',
                        'isTimerStarted',
                        // 'isGameStarted',
                        // 'turns',
                        // 'currentUserIndex',
                        'startUsersState'
                    ].join(',')
                })
                .then(({result}) => {
                    if (isEqual(previousState, result)) {
                        console.log('the same result');
                        return;
                    }

                    previousState = result;

                    view.props.setGameState(result);
                    // view.onRoomStateReceive();
                });
        }, 1e3);
    }

    startGame() {
        const view = this;

        view.setRoomState('isTimerStarted', true);
        view.setRoomState('startUsersState', view.props.gameState.state.users);
    }

    componentWillUnmount() {
        const view = this;
        const {roomStatesProc} = view.state;

        roomStatesProc.destroy();

        view.state = getDefaultState();
    }

    render() {
        const view = this;
        const {
            users, isTimerStarted, localization, defaultMoney, unitLimit, chat, startGameTimer
        } = view.props.gameState.state;
        const zeroUser = users[0] || null;

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
                {isItMe(user) && startGameTimer > 4 ?
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

            {isItMe(zeroUser) ?
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

            {!isItMe(zeroUser) || isTimerStarted ?
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
