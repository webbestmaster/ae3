/* global window, document */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './../home';
import Page from './../page';
import cnx from './../../helper/cnx';

const appConst = require('./../../app-const.json');

export default class App extends Component {
    constructor() {
        super();

        const view = this;

        view.attr = {
            wrapper: document.querySelector('.js-app-wrapper')
        };

        view.bindEventListeners();

        view.updateWrapperClassName();
    }

    bindEventListeners() {
        const view = this;

        window.addEventListener('resize', () => view.onResize(), false);
    }

    updateWrapperClassName() {
        const view = this;
        const docElem = window.document.documentElement;
        const screenWidth = docElem.clientWidth;
        const {wrapper} = view.attr;
        const currentClassName = wrapper.className;
        const newClassName = 'js-app-wrapper ' + cnx({
            'desktop-width': screenWidth >= appConst.size.desktopWidth,
            'lt-desktop-width': screenWidth < appConst.size.desktopWidth,
            'lt-tablet-width': screenWidth < appConst.size.tabletWidth
        }).className;

        if (currentClassName !== newClassName) {
            wrapper.className = newClassName;
        }
    }

    onResize() {
        const view = this;

        view.updateWrapperClassName();
    }

    render() {
        return <Switch>
            <Route path='/' component={Home} exact/>
            <Route path='/page' component={Page}/>
        </Switch>;
    }
}
