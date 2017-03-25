import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import * as reducers from './reducer';
import AppRouter from './app-router';

require('style/_root.scss');

// initialize environment
import initializeEnvironment from './initialize-environment';
initializeEnvironment();

const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <AppRouter history={history}/>
    </Provider>,
    document.querySelector('.js-app-wrapper')
);
