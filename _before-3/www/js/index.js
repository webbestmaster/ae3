/* global IS_PRODUCTION, IS_DEVELOPMENT */

// dev tools
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import whyDidYouUpdate from 'why-did-you-update';

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
    // whyDidYouUpdate(React);
    DevTools = createDevTools(
        <DockMonitor defaultIsVisible={false}
                     defaultSize={0.25}
                     toggleVisibilityKey="ctrl-h"
                     changePositionKey="ctrl-q">
            <LogMonitor />
            {/* <SliderMonitor keyboardEnabled /> */}
        </DockMonitor>);
    store = createStore(reducer, DevTools.instrument(), applyMiddleware(thunk));
}

const historyStore = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            {
                IS_PRODUCTION ?
                    <AppRouter history={historyStore}/> :
                    <div>
                        <AppRouter history={historyStore}/>
                        <div style={{fontSize: '13px'}}>
                            <DevTools />
                        </div>
                    </div>
            }
        </MuiThemeProvider>
    </Provider>,
    document.querySelector('.js-app-wrapper')
);

export {store};
