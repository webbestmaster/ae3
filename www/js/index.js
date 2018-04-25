// @flow
/* global window, IS_PRODUCTION */
// declare var IS_PRODUCTION: boolean;
/* global requestAnimationFrame */

import FastClick from 'fastclick';
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import App from './app';

import * as reducers from './app-reducer';

FastClick.attach(window.document.body);

const TWEEN = require('@tweenjs/tween.js');

(function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
})();

const reducer = combineReducers({
    ...reducers
});

let store = null;
let DevTools = null;

if (IS_PRODUCTION) { // eslint-disable-line id-match
    // store = createStore(reducer, applyMiddleware(thunk));
    store = compose(applyMiddleware.apply(this, applyMiddleware(thunk)))(createStore)(reducer); // eslint-disable-line prefer-reflect, no-invalid-this
} else {
    DevTools = createDevTools(
        <DockMonitor
            defaultIsVisible={false}
            defaultSize={0.25}
            toggleVisibilityKey="ctrl-h"
            changePositionKey="ctrl-q">
            <LogMonitor/>
        </DockMonitor>);
    store = createStore(reducer, DevTools.instrument(), applyMiddleware(thunk));
}

render(
    <Provider store={store}>
        {
            IS_PRODUCTION ? // eslint-disable-line id-match
                <BrowserRouter>
                    <App/>
                </BrowserRouter> :
                <div>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                    <div style={{fontSize: '13px'}}>
                        {DevTools === null ? null : <DevTools/>}
                    </div>
                </div>
        }
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);

export {store};
