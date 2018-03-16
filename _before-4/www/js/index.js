/* global window, IS_PRODUCTION, IS_DEVELOPMENT */
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import App from './components/app';

import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';

import styles from 'style/css/_root.scss'; // do not remove me
require('./lib/initialize-environment');

// import * as reducers from './reducer';
import * as reducers from './reducer';


// c.log(reducers.default);

// const reducer = combineReducers({
//     ...reducers
// });
const reducer = combineReducers({
    ...reducers
});

let store = null;
let DevTools = null;

if (IS_PRODUCTION) { // eslint-disable-line id-match
    store = createStore(reducer, applyMiddleware(thunk));
} else {
    DevTools = createDevTools(
        <DockMonitor defaultIsVisible={false}
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
            <HashRouter>
                <App/>
            </HashRouter> :
                <div>
                    <HashRouter>
                        <App/>
                    </HashRouter>
                    <div style={{fontSize: '13px'}}>
                        <DevTools/>
                    </div>
                </div>
        }
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);

export {store};
