import React from 'react';
// import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import Proc from './../lib/proc';
// import ajax from './../lib/ajax';
import _ from 'lodash';
import timer from './../lib/timer';
import api from './../user/api';
const mapGuide = require('./../../maps/map-guide.json');
const getDefaultState = () => ({
    users: [],
    timerCount: Infinity
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

        api.get.room.leave();

        pingProc.destroy();
        roomStatesProc.destroy();
    }

    componentDidMount() {
        const view = this;
        const pingProc = new Proc(api.get.room.pingUser, 1000);
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
                        'isTimerStarted',
                        'nextGameId'
                    ].join(',')
                })
                .then(rawResult => view.onRoomStateReceive(JSON.parse(rawResult).result));
        }, 1e3);

        view.setState({pingProc, roomStatesProc});
    }

    onRoomStateReceive(data) {
        const view = this;
        const {users} = data;
        const {publicId} = view.props.userState.publicIdState;
        const user = _.find(users, {publicId});
        const zeroUserPublicId = users[0] ? users[0].publicId : null;

        view.setState(data);

        // auto set 'team' and 'color'
        if (user && !user.team) {
            view.setUserProperty('team', view.refs.teamSelect.value);
            view.setUserProperty('color', view.refs.colorSelect.value);
        }

        // auto set 'defaultMoney' and 'unitLimit'
        if (publicId === zeroUserPublicId && !data.defaultMoney) {
            view.setRoomState('defaultMoney', view.refs.defaultMoney.value);
            view.setRoomState('unitLimit', view.refs.unitLimit.value);
        }

        // check preparing for game starting
        if (data.isTimerStarted && view.state.timerCount === Infinity) {
            timer(7, 1e3, count => {
                console.log(count);
                view.setState({timerCount: count});
            }, () => alert(data.nextGameId));
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

        view.setRoomState('isTimerStarted', true).then(() => {
            view.setRoomState('nextGameId', '100');
        });
    }

    render() {
        const view = this;
        const {state} = view;
        const userPublicId = view.props.userState.publicIdState.publicId;
        const zeroUserPublicId = state.users[0] ? state.users[0].publicId : null;

        return <div>
            <h1>{state.nextGameId}</h1>
            <h1>the room</h1>

            <h1>localization</h1>
            <p>{JSON.stringify(state.localization)}</p>
            <hr/>
            <h1>users part</h1>
            {state.users.map(user => <div key={user.publicId}>
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
                    <h1>unit defaultMoney: {state.defaultMoney}</h1>
                    <h1>unit limit: {state.unitLimit}</h1>
                </div>
            }
            <hr/>
            <p>{JSON.stringify(state.chat)}</p>

            <input ref="chatInput" type="text"/>
            <button onClick={() => view.sendMessage()}>sendMessage</button>

            {zeroUserPublicId !== userPublicId || state.isTimerStarted ?
                <button>disabled start game</button> :
                <button onClick={() => view.startGame()}>
                    start game
                </button>
            }

            <h1>{view.state.timerCount}</h1>
            {view.state.timerCount === 0 && <h1>THE GAME HAS BEGUN!</h1>}
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
