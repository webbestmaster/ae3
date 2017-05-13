import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import routerConst from './const.json';

import App from './../app';
import HomeView from './../home';

export default class AppRouter extends Component {
    render() {
        return <Router history={this.props.history}>
            <Route path={routerConst.link.root} component={App}>
                <IndexRoute component={HomeView}/>
            </Route>
        </Router>;
    }
}
