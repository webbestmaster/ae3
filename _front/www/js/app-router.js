import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import HomeView from './component/home-view';
import App from './component/app';
import appConst from './const';
import CreateGame from './component/create-game/view';
import OfferGame from './component/offer-game/view';
import JoinGame from './component/join-game/view';

export default class AppRouter extends Component {

    render() {
        return <Router history={this.props.history}>
            <Route path="/" component={App}>
                <IndexRoute component={HomeView}/>
                <Route path={appConst.link.createGame} component={CreateGame}/>
                <Route path={appConst.link.offerGame} component={OfferGame}/>
                <Route path={appConst.link.joinGame} component={JoinGame}/>
            </Route>
        </Router>;
    }

}
