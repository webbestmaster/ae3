/* global window */
import React, {Component} from 'react';
import homeStyle from './home.m.scss';

export default class Home extends Component {
    render() {
        return <h1 className={homeStyle.header + ' disabled'}>Home</h1>;
    }
}
