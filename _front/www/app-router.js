import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import {HomeView} from './component';
import {App} from './component';

export default class AppRouter extends Component {

    render() {
        return <Router history={this.props.history}>
            <Route path="/" component={App}>

                <IndexRoute component={HomeView}/>

            </Route>
        </Router>;
    }

}
