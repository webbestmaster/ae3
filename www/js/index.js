// @flow
/* global window */

import {initializeEnvironment} from './app/helper.js';
import React from 'react';
import {render} from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import {StoreProvider} from './components/store/provider';

import App from './app';

import * as reducers from './app-reducer';

initializeEnvironment();

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
            <StoreProvider>
                <App/>
            </StoreProvider>
        </BrowserRouter>
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);
