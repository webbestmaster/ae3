import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import routerConst from 'root/router/const.json';
import App from 'root/app';
import Home from 'root/home';
import CreateRoom from 'root/create-room';
import JoinRoom from 'root/join-room';
import Room from 'root/room';

export default class AppRouter extends Component {

    render() {
        return <Router history={this.props.history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path={routerConst.route.createRoom} component={CreateRoom}/>
                <Route path={routerConst.route.joinRoom} component={JoinRoom}/>
                <Route path={routerConst.route.room} component={Room}/>
            </Route>
        </Router>;
    }

}
