// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {Switch, Route, Link, BrowserRouter} from 'react-router-dom';

import Index from './../page/index';
import System from './../components/system';

export default (): Node[] =>
    [
        <System key="system"/>,
        <Switch key="switch">
            <Route path='/' component={Index} exact/>
        </Switch>
    ];
