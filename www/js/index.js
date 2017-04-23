/* global NODE_ENV */

// dev tools
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {hashHistory, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import * as reducers from './reducer';
import AppRouter from './router';

const IS_PRODUCTION = NODE_ENV === 'production';

require('style/css/_root.scss');

// initialize environment
import initializeEnvironment from './util/initialize-environment';
initializeEnvironment();

const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});


let store = null;
let DevTools = null;

if (IS_PRODUCTION) {
    store = createStore(reducer, applyMiddleware(thunk));
} else {
    DevTools = createDevTools(
        <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
            <LogMonitor theme="tomorrow" preserveScrollTop={false}/>
        </DockMonitor>);
    store = createStore(reducer, DevTools.instrument(), applyMiddleware(thunk));
}

const history = syncHistoryWithStore(hashHistory, store);
// const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        {
            IS_PRODUCTION
                ?
                <AppRouter history={history}/>
                :
                <div>
                    <AppRouter history={history}/>
                    <DevTools />
                </div>
        }
    </Provider>,
    document.querySelector('.js-app-wrapper')
);
