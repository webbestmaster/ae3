import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import HomeView from './component/home-view';
import App from './component/app';
import appConst from './const';
import CreateRoom from './component/create-room/view';
import OpenRoom from './component/open-room/view';
import JoinRoom from './component/join-room/view';

export default class AppRouter extends Component {

    render() {
        return <Router history={this.props.history}>
            <Route path="/" component={App}>
                <IndexRoute component={HomeView}/>
                <Route path={appConst.link.createRoom} component={CreateRoom}/>
                <Route path={appConst.link.openRoom} component={OpenRoom}/>
                <Route path={appConst.link.joinRoom} component={JoinRoom}/>
            </Route>
        </Router>;
    }

}
