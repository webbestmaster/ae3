import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';
import ajax from './../util/ajax';
import httpConst from './../../main/http-const.json';
import user from './../model/user';
import routerConst from './../router/const.json';

class JoinRoom extends BaseView {

    constructor() {
        super();

        this.state = {
            roomIds: []
        };
    }

    componentDidMount() {
        const view = this;

        ajax
            .get(httpConst.route.getAvailableRooms)
            .then(roomIds => {
                view.setState({roomIds: JSON.parse(roomIds)});
            });
    }

    enterRoom(id) {
        const view = this;

        user.set(user.const.roomId, id);
        user.enterRoom()
            .then(() => view.props.router.push(routerConst.route.room));
    }

    render() {
        const view = this;
        const {roomIds} = view.state;

        return <div>
            <h1>join room</h1>
            {roomIds.map(id => <h1 onClick={() => view.enterRoom(id)} key={id}>{id}</h1>)}
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(JoinRoom);
