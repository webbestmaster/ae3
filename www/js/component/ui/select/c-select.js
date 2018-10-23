// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {SelectIconNameType} from './icon/c-icon';
import {icon} from './icon/c-icon';
import {isString} from '../../../lib/is/is';
import Canvas from '../canvas/c-canvas';

type PropsType = {|
    +children: Node,
    +onChange: (value: string) => void,
    +icon?: SelectIconNameType
    // className?: string
|};

type StateType = {|
    visibleString: string
|};

type NodeType = {|
    select: {current: HTMLSelectElement | null}
|};

export default class Select extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    node: NodeType;

    constructor() {
        super();

        const view = this;

        view.state = {
            visibleString: ''
        };

        view.node = {
            select: React.createRef()
        };
    }

    componentDidMount() {
        const view = this;

        view.handleOnChangeSelect();
    }

    renderIcon(): Node | null {
        const view = this;
        const {props, state} = view;
        const iconPath = isString(props.icon) ? props.icon : null;

        if (iconPath === null) {
            return null;
        }

        // eslint-disable-next-line id-match
        if (!IS_PRODUCTION) {
            if (!icon.hasOwnProperty(iconPath)) {
                console.error('unsupported iconPath', iconPath);
                return null;
            }
        }

        return <Canvas width={24} height={24} className={style.icon} src={icon[iconPath]}/>;
    }

    handleOnChangeSelect = () => {
        const view = this;
        const {props} = view;

        const selectNode = view.node.select.current;

        if (selectNode === null) {
            console.error('select node is not defined');
            return;
        }

        view.setState({visibleString: selectNode.value});
        props.onChange(selectNode.value);
    };

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <label className={style.wrapper}>
                {view.renderIcon()}
                {state.visibleString.length > 0 ?
                    <p className={style.current_selected}>{state.visibleString}</p> :
                    <p className={style.current_selected}>&nbsp;</p>
                }
                <select
                    ref={view.node.select}
                    onChange={view.handleOnChangeSelect}
                    onBlur={view.handleOnChangeSelect}
                    className={style.select}
                >
                    {props.children}
                </select>
            </label>
        );
    }
}
