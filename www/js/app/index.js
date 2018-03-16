// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {Switch, Route, Link, BrowserRouter} from 'react-router-dom';

import Index from './../page/index';

export default (): Node => <div>
    <Switch key="switch">
        <Route path='/' component={Index} exact/>
    </Switch>
</div>;
