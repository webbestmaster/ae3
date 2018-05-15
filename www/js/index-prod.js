// @flow
/* global window */

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

// TODO: wait for flow-typed redux@4.x.x
// $FlowFixMe
const store = createStore(reducer, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    window.document.querySelector('.js-app-wrapper')
);
