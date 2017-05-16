import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Proc from './../lib/proc';
import ajax from './../lib/ajax';
import _ from 'lodash';
import timer from './../lib/timer';
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
            users: [],
            timerCount: Infinity
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
                    'chat',
                    'isTimerStarted'
                ].join(','))
            ).then(rawResult => {
                view.setState(JSON.parse(rawResult).result);

                const {users} = view.state;
                const {publicId} = view.props.userState.publicIdState;
                const user = _.find(users, {publicId});

                if (user && !user.team) {
                    view.setUserProperty('team', view.refs.teamSelect.value);
                    view.setUserProperty('color', view.refs.colorSelect.value);
                }

                const zeroUserPublicId = users[0] ? users[0].publicId : null;

                if (publicId === zeroUserPublicId) {
                    view.setRoomState('defaultMoney', view.refs.defaultMoney.value);
                    view.setRoomState('unitLimit', view.refs.unitLimit.value);
                }

                if (view.state.isTimerStarted && view.state.timerCount === Infinity) {
                    timer(7, 1e3, count => {
                        console.log(count);
                        view.setState({timerCount: count});
                    });
                }
            });
        }, 1000);

        view.setState({pingProc, roomStatesProc});
    }

    setUserProperty(key, value) {
        const view = this;
        const {roomIdState, idState} = view.props.userState;

        ajax.post(
            apiRouteConst.route.setUserRoomState
                .replace(':roomId', roomIdState.roomId)
                .replace(':privateUserId', idState.id),
            {[key]: value}
        );
    }

    setRoomState(key, value) {
        const view = this;
        const {roomIdState, idState} = view.props.userState;

        ajax.post(
            apiRouteConst.route.setRoomState
                .replace(':roomId', roomIdState.roomId)
                .replace(':privateUserId', idState.id),
            {[key]: value}
        );
    }

    render() {
        const view = this;
        const {state} = view;
        const userPublicId = view.props.userState.publicIdState.publicId;
        const zeroUserPublicId = state.users[0] ? state.users[0].publicId : null;

        return <div>
            <h1>the room</h1>

            <h1>localization</h1>
            <p>{JSON.stringify(state.localization)}</p>
            <hr/>
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

            {zeroUserPublicId === userPublicId ?
                <button disabled={state.isTimerStarted}
                        onClick={() => view.setRoomState('isTimerStarted', true)}>
                    start game
                </button> :
                <button>disabled start game</button>
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
