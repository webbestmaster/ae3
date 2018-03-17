// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {Switch, Route, Link, BrowserRouter} from 'react-router-dom';
import System from './../components/system';

import Index from './../page/index';
import MultiPlayer from './../page/multi-player';

import routes from './routes';

export default (): Node[] =>
    [
        <System key="system"/>,
        <Switch key="switch">
            <Route path={routes.index} component={Index} exact/>
            <Route path={routes.multiPlayer} component={MultiPlayer} exact/>
        </Switch>
    ];
