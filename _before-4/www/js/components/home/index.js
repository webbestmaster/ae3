/* global window */
import React, {Component} from 'react';
import homeStyle from './style.m.scss';
import {Link} from 'react-router-dom';

export default class Home extends Component {
    render() {
        return <div>
            <h1 className={homeStyle.header}>__text__home-page</h1>
            <br/>
            <br/>
            <Link to="/creating-game">__text__create-game</Link>
            <br/>
            <br/>
            <Link to="/join-game">__text__join-game</Link>
            <br/>
            <br/>
            <Link to="/settings">__text__settings</Link>

        </div>;
    }
}
