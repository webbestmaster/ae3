// @flow

/* eslint consistent-this: ["error", "view"] */

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from '../../../lib/is';
import * as PIXI from 'pixi.js';
import isEqual from 'lodash/isEqual';

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
    app: PIXI.Application | null;

    constructor() {
        super();

        const view = this;

        view.state = {
            state: 0
        };

        view.app = null;

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

        view.app = new PIXI.Application(width, height, {
            view: canvas,
            autoStart: false,
            clearBeforeRender: false,
            sharedTicker: false,
            sharedLoader: true,
            transparent: true,
            resolution: window.devicePixelRatio || 1
        });
    }

    componentDidMount() {
        const view = this;

        view.initApp();
        view.drawSprite();
    }

    drawSprite() {
        const view = this;
        const {props, attr, app} = view;
        const {canvas} = attr;
        const {width, height, src} = props;

        if (canvas === null || app === null) {
            console.error('canvas is not define or app');
            return;
        }

        app.stage.removeChildren(0, 1);

        const sprite = PIXI.Sprite.fromImage(src);

        sprite.width = width;
        sprite.height = height;

        app.stage.addChild(sprite);
        app.render();
    }

    componentDidUpdate(prevProps: PassedPropsType) {
        const view = this;
        const {props} = view;

        if (props.src === prevProps.src) {
            return;
        }

        view.drawSprite();
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
