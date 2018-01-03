/* global window */
import React, {Component} from 'react';
import homeStyle from './style.m.scss';
import {Link} from 'react-router-dom';

export default class Home extends Component {
    render() {
        return <div>
            <h1 className={homeStyle.header}>Home</h1>

            <Link to="/make-room">make-room</Link>

            <Link to="/page">to page</Link>
        </div>;
    }
}
