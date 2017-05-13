import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Proc from './../lib/proc';
import ajax from './../lib/ajax';
const apiRouteConst = require('./../api-route.json');

class RoomView extends BaseView {
    componentWillUnmount() {
        const view = this;
        const {roomIdState, idState} = view.props.userState;
        const {pingProc} = view.state;

        pingProc.destroy();

        ajax.get(apiRouteConst.route.leaveRoom
            .replace(':roomId', roomIdState.roomId)
            .replace(':privateUserId', idState.id)
        );
    }

    componentDidMount() {
        // get room state -> users, map, defaultMoneyList, unitLimitList
        const view = this;
        const {roomIdState, idState} = view.props.userState;

        const pingProc = new Proc(() => {
            return ajax.get(apiRouteConst.route.pingUserRoom
                .replace(':roomId', roomIdState.roomId)
                .replace(':privateUserId', idState.id)
            );
        }, 1000);

        view.setState({pingProc});
    }

    render() {
        return <div>
            <h1>the room</h1>
        </div>;
    }
}

RoomView.propTypes = {
};

export default connect(
    state => ({
        userState: state.userState
    }),
    {
    }
)(RoomView);
