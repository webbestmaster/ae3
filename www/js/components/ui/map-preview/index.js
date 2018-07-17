// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import React, {Component} from 'react';
import type {Node} from 'react';
import type {MapType} from './../../../maps/type';
import style from './style.scss';
import * as PIXI from 'pixi.js';
import imageMap from './../../game/image/image-map';
import mapGuide from './../../../maps/map-guide';
import type {LandscapeType} from './../../../maps/type';
import {getMapSize} from '../../game/model/helper';

type StateType = void;
type PropsType = {|
    map: MapType,
    className?: string
|};

type NodeType = {|
    canvas: HTMLElement | null
|};

type LayerListType = {|
    +landscape: PIXI.Container
|};

export default class MapPreview extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    node: NodeType;
    layer: LayerListType;
    app: PIXI.Application;

    constructor() {
        super();

        const view = this;

        view.node = {
            canvas: null
        };

        view.layer = {
            landscape: new PIXI.Container()
        };
    }

    initApp() {
        const view = this;
        const {props, node} = view;
        const {canvas} = node;
        const {map} = props;

        if (canvas === null) {
            console.error('canvas is not define');
            return;
        }

        const mapSize = getMapSize(map);

        view.app = new PIXI.Application(
            mapSize.width * mapGuide.size.square,
            mapSize.height * mapGuide.size.square,
            {
                autoStart: false,
                view: canvas,
                clearBeforeRender: true,
                sharedTicker: true,
                sharedLoader: true,
                transparent: true,
                backgroundColor: 0x1099bb,
                resolution: 1
            }
        );
    }

    drawLandscape() {
        const view = this;
        const {props, app, layer} = view;
        const {map} = props;
        const {landscape} = layer;

        map.landscape.forEach((list: Array<LandscapeType>, tileY: number) => {
            list.forEach((landscapeItem: LandscapeType, tileX: number) => {
                const container = new PIXI.Container();
                const sprite = PIXI.Sprite.fromImage(imageMap.landscape[landscapeItem]);

                container.addChild(sprite);

                container.position.set(tileX * mapGuide.size.square, tileY * mapGuide.size.square);

                landscape.addChild(container);
            });
        });

        app.stage.addChild(landscape);
    }

    componentDidMount() {
        const view = this;
        const {props, node} = view;
        const {canvas} = node;

        if (canvas === null) {
            console.error('canvas is not define');
            return;
        }

        view.initApp();
        view.drawLandscape();
    }

    render(): Node {
        const view = this;
        const {props, node} = view;
        const additionClass = typeof props.className === 'string' ? ' ' + props.className : '';

        return (
            <div className={style.wrapper + additionClass}>
                <canvas
                    className={style.canvas}
                    ref={(canvas: HTMLElement | null) => {
                        node.canvas = canvas;
                    }}
                />
            </div>
        );
    }
}
