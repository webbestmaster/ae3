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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as reducers from './reducer';
import AppRouter from './router';

const IS_PRODUCTION = NODE_ENV === 'production';

import styles from 'style/css/_root.scss'; // do not remove me

// initialize environment
import initializeEnvironment from './lib/initialize-environment';
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

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            {
                !IS_PRODUCTION ?
                    <AppRouter history={history}/> :
                    <div>
                        <AppRouter history={history}/>
                        <DevTools />
                    </div>
            }
        </MuiThemeProvider>
    </Provider>,
    document.querySelector('.js-app-wrapper')
);
