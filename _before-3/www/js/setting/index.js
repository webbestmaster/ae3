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
import {isItMe, getMyOrder} from './../lib/me';
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

    componentDidMount() {
        const view = this;

        view.getMainGameData()
            .then(({result}) => {
                const myOrder = getMyOrder(result.users);
                const promiseList = [
                    view.setUserProperty('color', mapGuide.colorList[myOrder]),
                    view.setUserProperty('team', mapGuide.teamList[myOrder])
                ];

                if (!result.defaultMoney) {
                    promiseList.push(
                        view.setRoomState('defaultMoney', mapGuide.defaultMoneyList[0]),
                        view.setRoomState('unitLimit', mapGuide.unitLimitList[0])
                    );
                }

                return Promise.all(promiseList);
            })
            .then(() => view.getMainGameData())
            .then(({result}) => {
                view.props.setGameState(result);
                view.startListening();
            });
    }

    startListening() {
        const view = this;

        view.state.roomStatesProc = new Proc(() => view.fetchData(), 1e3);
    }

    fetchData() {
        const view = this;

        return api.get.room
            .getStates({
                keys: [
                    'users',
                    'defaultMoney',
                    'unitLimit',
                    'chat',
                    'isTimerStarted'
                ].join(',')
            })
            .then(({result}) => {
                const previousState = view.props.gameState.state;

                Object.keys(result).forEach(key => {
                    if (!isEqual(result[key], previousState[key])) {
                        view.props.setGameState({[key]: result[key]});
                    }
                });
            });
    }

    sendMessage() {
        const view = this;

        api.post.room
            .pushToKey(null, {
                chat: {
                    publicId: view.props.userState.publicIdState.publicId,
                    text: view.refs.chatInput.value
                }
            })
            .then(() => view.fetchData());
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
        return api.get.room
            .getStates({
                keys: [
                    'localization',
                    'landscape',
                    'buildings',
                    'units',
                    'graves',
                    'gameName',
                    'password',
                    'users',
                    'defaultMoney',
                    'unitLimit',
                    'gameType'
                ].join(',')
            });
    }

    startGame() {
        const view = this;

        const {users} = view.props.gameState.state;

        Promise
            .all([
                view.setRoomState('isTimerStarted', true),
                view.setRoomState('currentUserPublicId', users[0].publicId)
            ])
            .then(() => view.fetchData());
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
            users, isTimerStarted, localization, defaultMoney, unitLimit, chat, startGameTimer, gameType
        } = view.props.gameState.state;

        if (users.length === 0) {
            return <h1>initializing...</h1>;
        }

        const zeroUser = users[0];

        return <div>
            <h1>settings</h1>
            <h1>startGameTimer: {startGameTimer}</h1>
            <h1>gameType: {gameType}</h1>

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
                            defaultValue={defaultMoney}
                            onChange={evt => view.setRoomState('defaultMoney', Number(evt.currentTarget.value))}>
                        {mapGuide.defaultMoneyList.map(money =>
                            <option key={money} value={money}>{money}</option>
                        )}
                    </select>
                    <h1>unit limit</h1>
                    <select ref="unitLimit"
                            defaultValue={unitLimit}
                            onChange={evt => view.setRoomState('unitLimit', Number(evt.currentTarget.value))}>
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
