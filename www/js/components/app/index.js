/* global window */
import React, {Component} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import Home from './../home';

export default () => <Switch>
    <Route path='/' component={Home} exact/>
</Switch>;
