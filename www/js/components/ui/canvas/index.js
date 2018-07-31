// @flow

/* eslint consistent-this: ["error", "view"] */

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from '../../../lib/is';
import * as PIXI from 'pixi.js';

type PassedPropsType = {|
    +className?: string,
    +width: number,
    +height: number,
    +src: string
|};

type StateType = {|
    +state: number
|};

type AttrType = {|
    +canvas: HTMLElement | null
|};

export default class Canvas extends Component<PassedPropsType, StateType> {
    props: PassedPropsType;
    state: StateType;
    attr: AttrType;

    constructor() {
        super();

        const view = this;

        view.state = {
            state: 0
        };

        view.attr = {
            canvas: null
        };
    }

    initApp() {
        const view = this;
        const {props, attr} = view;
        const {canvas} = attr;
        const {width, height, src} = props;

        if (canvas === null) {
            console.error('canvas is not define');
            return;
        }

        const app = new PIXI.Application(width, height, {
            view: canvas,
            autoStart: false,
            clearBeforeRender: false,
            sharedTicker: false,
            sharedLoader: true,
            transparent: true,
            resolution: window.devicePixelRatio || 1
        });

        const sprite = PIXI.Sprite.fromImage(src);

        sprite.width = width;
        sprite.height = height;

        app.stage.addChild(sprite);
        app.render();
    }

    componentDidMount() {
        const view = this;

        view.initApp();
    }

    componentDidUpdate() {
        const view = this;

        view.componentDidMount();
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <canvas
                style={{width: props.width, height: props.height}}
                ref={(node: HTMLElement | null) => {
                    view.attr = {canvas: node};
                }}
                className={style.canvas + additionClass}
            />
        );
    }
}
