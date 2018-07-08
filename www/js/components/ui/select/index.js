// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {SelectIconNameType} from './icon';
import {icon} from './icon';

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
    select: HTMLSelectElement | null
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
            select: null
        };
    }

    componentDidMount() {
        const view = this;

        view.onSelectChange();
    }

    onSelectChange() {
        const view = this;
        const {props} = view;

        const selectNode = view.node.select;

        if (selectNode === null) {
            console.error('select node is not defined');
            return;
        }

        view.setState({visibleString: selectNode.value});
        props.onChange(selectNode.value);
    }

    renderIcon(): Node | null {
        const view = this;
        const {props, state} = view;
        const iconPath = typeof props.icon === 'string' ? props.icon : null;

        if (iconPath === null) {
            return null;
        }

        if (!IS_PRODUCTION) { // eslint-disable-line id-match
            if (!icon.hasOwnProperty(iconPath)) {
                console.error('unsupported iconPath', iconPath);
                return null;
            }
        }

        return (
            <img
                className={style.icon}
                src={icon[iconPath]}
                alt=""
            />
        );
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return (
            <label className={style.wrapper}>
                {view.renderIcon()}
                {
                    state.visibleString.length > 0 ?
                        <p className={style.current_selected}>
                            {state.visibleString}
                        </p> :
                        <p className={style.current_selected}>
                            &nbsp;
                        </p>
                }
                <select
                    ref={(select: HTMLSelectElement | null) => {
                        view.node.select = select;
                    }}
                    onChange={() => {
                        view.onSelectChange();
                    }}
                    className={style.select}
                >
                    {props.children}
                </select>
            </label>
        );
    }
}