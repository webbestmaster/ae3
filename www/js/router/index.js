import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import routerConst from './const.json';
import App from './../app';
import Home from './../home';
import CreateRoom from './../create-room';
import JoinRoom from './../join-room';
import Room from './../room';

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
