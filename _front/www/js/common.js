require('es6-promise').polyfill();

// added here avoid added they to main.js
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
