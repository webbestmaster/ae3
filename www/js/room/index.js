import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import Proc from './../lib/proc';
// import ajax from './../lib/ajax';
import _ from 'lodash';
import timer from './../lib/timer';
import api from './../user/api';
import * as gameAction from './../game/action';
import GameView from './../game';
const mapGuide = require('./../../maps/map-guide.json');
const getDefaultState = () => ({
    timerCount: Infinity,
    gameIsStarted: false,
    pingProc: null,
    roomStatesProc: null
});

class RoomView extends BaseView {
    sendMessage() {
        const view = this;

        api.post.room.pushToKey(null, {
            chat: {
                publicId: view.props.userState.publicIdState.publicId,
                text: view.refs.chatInput.value
            }
        });
    }

    constructor() {
        super();

        this.state = getDefaultState();
    }

    componentWillUnmount() {
        const view = this;
        const {pingProc, roomStatesProc} = view.state;

        view.state = getDefaultState();
        view.props.resetGameState();
        api.get.room.leave();

        pingProc.destroy();
        roomStatesProc.destroy();
    }

    componentDidMount() {
        const view = this;
        const pingProc = new Proc(api.get.room.pingUser, 1000);
        let previousState = {};

        const roomStatesProc = new Proc(() => {
            api.get.room
                .getStates({
                    keys: [
                        'localization',
                        'landscape',
                        'building',
                        'unit',
                        'users',
                        'defaultMoney',
                        'unitLimit',
                        'gameName',
                        'password',
                        'chat',
                        'isTimerStarted'
                    ].join(',')
                })
                .then(rawResult => {
                    const {result} = JSON.parse(rawResult);

                    if (_.isEqual(previousState, result)) {
                        console.log('the same result');
                        return;
                    }

                    previousState = result;

                    view.props.setGameState(result);
                    view.onRoomStateReceive();
                });
        }, 1e3);

        view.state.pingProc = pingProc;
        view.state.roomStatesProc = roomStatesProc;
    }

    onRoomStateReceive() {
        const view = this;
        const {users, defaultMoney, isTimerStarted} = view.props.gameState.state;
        const {publicId} = view.props.userState.publicIdState;
        const user = _.find(users, {publicId});
        const zeroUserPublicId = users[0] ? users[0].publicId : null;

        // auto set 'team' and 'color'
        if (user && !user.team) {
            view.setUserProperty('team', view.refs.teamSelect.value);
            view.setUserProperty('color', view.refs.colorSelect.value);
        }

        // auto set 'defaultMoney' and 'unitLimit'
        if (publicId === zeroUserPublicId && !defaultMoney) {
            view.setRoomState('defaultMoney', view.refs.defaultMoney.value);
            view.setRoomState('unitLimit', view.refs.unitLimit.value);
        }

        // check preparing for game starting
        if (isTimerStarted && view.state.timerCount === Infinity) {
            timer(7, 0.1e3, count => {
                console.log(count);
                view.setState({timerCount: count});
            }, () => view.setState({gameIsStarted: true}));
        }
    }

    setUserProperty(key, value) {
        return api.post.room.setUserState(null, {[key]: value});
    }

    setRoomState(key, value) {
        return api.post.room.setState(null, {[key]: value});
    }

    startGame() {
        const view = this;

        view.setRoomState('isTimerStarted', true);
    }

    getSetupPage() {
        const view = this;
        const userPublicId = view.props.userState.publicIdState.publicId;
        const {
            users, gameIsStarted, localization, defaultMoney, unitLimit, isTimerStarted, chat
        } = view.props.gameState.state;
        const zeroUserPublicId = users[0] ? users[0].publicId : null;

        return <div>
            <h1>gameIsStarted: {Number(gameIsStarted)}</h1>
            <h1>the room</h1>

            <h1>localization</h1>
            <p>{JSON.stringify(localization)}</p>
            <hr/>
            <h1>users part</h1>
            {users.map(user => <div key={user.publicId}>
                <h2>{user.publicId}</h2>
                <p>{JSON.stringify(user)}</p>
                {userPublicId === user.publicId && view.state.timerCount >= 3 ?
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

            <h1>{view.state.timerCount}</h1>
        </div>;
    }

    render() {
        const view = this;

        if (view.state.timerCount !== 0) {
            return view.getSetupPage();
        }

        return <GameView/>;
    }
}

RoomView.propTypes = {
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
    resetGameState: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userState: state.userState,
        gameState: state.gameState
    }),
    {
        setGameState: gameAction.setState,
        resetGameState: gameAction.resetState
    }
)(RoomView);
