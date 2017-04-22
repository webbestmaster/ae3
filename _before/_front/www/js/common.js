require('es6-promise').polyfill();

// added here avoid added they to main.js
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

// dev tools
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
