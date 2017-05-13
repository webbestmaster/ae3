// added here to avoid added they to main.js
// if you know better way, please, talk to me. BR, Dmitry Turvotsov

import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {hashHistory, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import _ from 'lodash';
import classnames from 'classnames';
import initializeEnvironment from './lib/initialize-environment';
import moment from 'moment';
import sha1 from 'sha1';
import es6Promise from 'es6-promise';
import fastclick from 'fastclick';
import injectTapEventPlugin from 'react-tap-event-plugin';
import materialUi from 'material-ui';

// dev tools
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import whyDidYouUpdate from 'why-did-you-update';
