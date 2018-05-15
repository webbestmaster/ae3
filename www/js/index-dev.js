// @flow
/* global window */

import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import App from './app';
import {initializeEnvironment} from './app/helper.js';

initializeEnvironment();

import * as reducers from './app-reducer';

const reducer = combineReducers({
    ...reducers
});

const DevTools = createDevTools(
    <DockMonitor
        defaultIsVisible={false}
        defaultSize={0.25}
        toggleVisibilityKey="ctrl-h"
        changePositionKey="ctrl-q">
        <LogMonitor/>
    </DockMonitor>);

// TODO: wait for flow-typed redux@4.x.x
// $FlowFixMe
const store = createStore(reducer, DevTools.instrument(), applyMiddleware(thunk));

render(
    <Provider store={store}>
        <div>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
            <div style={{fontSize: '13px'}}>
                <DevTools/>
            </div>
        </div>
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);
