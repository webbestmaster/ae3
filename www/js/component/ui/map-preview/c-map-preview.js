// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import type {BuildingType, LandscapeType, MapType, UnitType} from '../../../maps/type';
import style from './style.scss';
import * as PIXI from 'pixi.js';
import imageMap from '../../game/image/image-map';
import mapGuide from '../../../maps/map-guide';
import {getMapSize, getUserColor} from '../../game/model/helper';
import {getDefaultUserList} from './helper';
import {isString} from '../../../lib/is/is';

type StateType = void;
type PropsType = {|
    map: MapType,
    className?: string,
    canvasClassName?: string
|};

type NodeType = {|
    canvas: {current: HTMLCanvasElement | null}
|};

type LayerListType = {|
    +landscape: PIXI.Container,
    +unitList: PIXI.Container,
    +buildingList: PIXI.Container
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
            canvas: React.createRef()
        };

        view.layer = {
            landscape: new PIXI.Container(),
            unitList: new PIXI.Container(),
            buildingList: new PIXI.Container()
        };
    }

    initApp() {
        const view = this;
        const {props, node, layer} = view;
        const canvas = node.canvas.current;
        const {map} = props;

        if (canvas === null) {
            console.error('canvas is not define');
            return;
        }

        const mapSize = getMapSize(map);

        const app = new PIXI.Application(mapSize.width * mapGuide.size.square, mapSize.height * mapGuide.size.square, {
            view: canvas,
            autoStart: false,
            clearBeforeRender: false,
            sharedTicker: false,
            sharedLoader: true,
            transparent: true,
            backgroundColor: 0x1099BB,
            resolution: window.devicePixelRatio || 1
        });

        app.stage.addChild(layer.landscape);
        app.stage.addChild(layer.buildingList);
        app.stage.addChild(layer.unitList);

        view.app = app;
    }

    drawLandscape() {
        const view = this;
        const {props, layer} = view;
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
    }

    drawBuildingList() {
        const view = this;
        const {props, layer} = view;
        const {map} = props;
        const {buildingList} = layer;
        const {square} = mapGuide.size;

        const userList = getDefaultUserList();

        // eslint-disable-next-line complexity
        map.buildings.forEach((building: BuildingType) => {
            const {type} = building;

            let sprite = null;

            if (['castle', 'farm'].includes(type)) {
                let color = 'gray';

                if (isString(building.userId)) {
                    const userColor = getUserColor(building.userId, userList);

                    if (isString(userColor)) {
                        color = userColor;
                    }
                }

                sprite = PIXI.Sprite.fromImage(imageMap.building[type + '-' + color]);
            }

            if (['well', 'temple', 'farm-destroyed'].includes(type)) {
                sprite = PIXI.Sprite.fromImage(imageMap.building[type]);
            }

            if (sprite === null) {
                console.error('can not detect sprite');
                return;
            }

            if (type === 'castle') {
                sprite.position.set(building.x * square, building.y * square - square);
            } else {
                sprite.position.set(building.x * square, building.y * square);
            }

            buildingList.addChild(sprite);
        });
    }

    drawUnitList() {
        const view = this;
        const {props, layer} = view;
        const {map} = props;
        const {unitList} = layer;
        const {square} = mapGuide.size;

        const userList = getDefaultUserList();

        map.units.forEach((unit: UnitType) => {
            let color = 'gray';

            if (isString(unit.userId)) {
                const userColor = getUserColor(unit.userId, userList);

                if (isString(userColor)) {
                    color = userColor;
                }
            }

            const sprite = PIXI.Sprite.fromImage(imageMap.unit[unit.type + '-' + color + '-0']);

            sprite.position.set(unit.x * square, unit.y * square);

            unitList.addChild(sprite);
        });
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
        view.drawBuildingList();
        view.drawUnitList();

        view.app.render();
    }

    render(): Node {
        const view = this;
        const {props, node} = view;
        const additionClass = isString(props.className) ? ' ' + props.className : '';
        const additionCanvasClassName = isString(props.canvasClassName) ? ' ' + props.canvasClassName : '';
        const mapSize = getMapSize(props.map);

        return (
            <div className={style.wrapper + additionClass}>
                <canvas
                    style={{
                        width: mapSize.width * mapGuide.size.square,
                        height: mapSize.height * mapGuide.size.square
                    }}
                    className={style.canvas + additionCanvasClassName}
                    ref={view.node.canvas}
                />
            </div>
        );
    }
}
