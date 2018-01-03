// @flow
/* global window, document, HTMLElement */
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './../home';
import Page from './../page';
import cnx from './../../helper/cnx';
import {user} from './../../module/user';
import {store} from './../../index';
import * as appAction from './action';

const appGlobalConst = require('./../../app-const.json');

type Props = { /* ... */ };

type State = {
    count: number,
};

type Attr = {
    wrapper: HTMLElement | null
}

export default class App extends Component<Props, State> {
    attr: Attr
    constructor() {
        super();

        const view = this;

        view.attr = {
            wrapper: document.querySelector('.js-app-wrapper')
        };

        view.bindEventListeners();

        view.onResize();
    }

    bindEventListeners():void {
        const view = this;

        window.addEventListener('resize', () => view.onResize(), false);
    }

    onResize():void {
        const view = this;

        const docElem = window.document.documentElement;
        const screenWidth = docElem.clientWidth;
        const screenHeight = docElem.clientHeight;
        const {wrapper} = view.attr;

        if (wrapper === null) {
            return;
        }

        // set wrapper class name
        const currentClassName = wrapper.className;
        const newClassName = 'js-app-wrapper ' + cnx({
            'desktop-width': screenWidth >= appGlobalConst.size.desktopWidth,
            'lt-desktop-width': screenWidth < appGlobalConst.size.desktopWidth,
            'lt-tablet-width': screenWidth < appGlobalConst.size.tabletWidth
        }).className;

        if (currentClassName !== newClassName) {
            wrapper.className = newClassName;
        }

        // store window size
        store.dispatch(appAction.setScreenSize(screenWidth, screenHeight));
    }

    render() {
        return <Switch>
            <Route path='/' component={Home} exact/>
            <Route path='/page' component={Page}/>
        </Switch>;
    }
}
