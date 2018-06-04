// @flow
/* global window */

import React from 'react';
import {render} from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';

import App from './app';
import {initializeEnvironment} from './app/helper.js';

initializeEnvironment();

import * as reducers from './app-reducer';

const reducer = combineReducers({
    ...reducers
});

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);
