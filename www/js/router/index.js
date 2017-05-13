import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import App from './../app';
import HomeView from './../home';
import SetupRoomView from './../setup-room';
import RoomView from './../room';

const routerConst = require('./const.json');

export default class AppRouter extends Component {
    render() {
        return <Router history={this.props.history}>
            <Route path={routerConst.link.root} component={App}>
                <IndexRoute component={HomeView}/>
                <Route path={routerConst.link.setupRoom} component={SetupRoomView}/>
                <Route path={routerConst.link.room} component={RoomView}/>
            </Route>
        </Router>;
    }
}
