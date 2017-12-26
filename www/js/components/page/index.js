/* global window */
import React, {Component} from 'react';
import style from './style.m.scss';

export default class Home extends Component {
    render() {
        return <h1 className={style.page_header}>Page header</h1>;
    }
}
