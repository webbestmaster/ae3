import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import Proc from './../lib/proc';
// import ajax from './../lib/ajax';
import _ from 'lodash';
// import timer from './../lib/timer';
import api from './../user/api';
import * as gameAction from './../game/action';
import GameView from './../game';
import SettingView from './../setting';
// const mapGuide = require('./../../maps/map-guide.json');
const getDefaultState = () => ({
    pingProc: null,
    roomStatesProc: null
});

class RoomView extends BaseView {
    constructor() {
        super();

        this.state = getDefaultState();
    }

    componentWillUnmount() {
        const view = this;
        const {pingProc, roomStatesProc} = view.state;

        api.get.room.leave();

        pingProc.destroy();
        roomStatesProc.destroy();

        view.props.resetGameState();
        view.state = getDefaultState();
    }

    componentDidMount() {
        const view = this;
        const pingProc = new Proc(api.get.room.pingUser, 1000);
        let previousState = {};

        const roomStatesProc = new Proc(() => {
            return api.get.room
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
                        'isGameStarted',
                        'turns',
                        'currentUserIndex',
                        'startUsersState'
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
                    // view.onRoomStateReceive();
                });
        }, 1e3);

        view.state.pingProc = pingProc;
        view.state.roomStatesProc = roomStatesProc;
    }

    render() {
        const view = this;
        const {users, startGameTimer} = view.props.gameState.state;

        if (!users || users.length === 0) {
            return <h1>initializing...</h1>;
        }

        if (startGameTimer === 0) {
            return <GameView/>;
        }

        return <SettingView/>;

        /*
         const {timerCount} = this.state;

         return timerCount === 0 ? <GameView/> :
         <div>
         <SettingView/>
         </div>;
         */
    }
}

RoomView.propTypes = {
    gameState: PropTypes.shape({
        state: PropTypes.shape({
            users: PropTypes.arrayOf(
                PropTypes.shape({
                    publicId: PropTypes.string.isRequired
                }).isRequired
            ).isRequired
        }).isRequired
    }).isRequired,
    setGameState: PropTypes.func.isRequired,
    resetGameState: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gameState: state.gameState
    }),
    {
        setGameState: gameAction.setState,
        resetGameState: gameAction.resetState
    }
)(RoomView);
