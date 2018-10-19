// @flow

/* eslint consistent-this: ["error", "view"] */

/* global window */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import {isString} from '../../../lib/is/is';
import type {ScaledImageDataType} from '../../app/helper-image';
import {imageCache} from '../../app/helper-image';

type PassedPropsType = {|
    +className?: string,
    +width: number,
    +height: number,
    +src: string
|};

type StateType = {};

export default class Canvas extends Component<PassedPropsType, StateType> {
    props: PassedPropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {};
    }

    getSrc(): string {
        const view = this;
        const {props, state} = view;

        const cachedImageData =
            imageCache.find(
                (cachedImageDataInList: ScaledImageDataType): boolean => {
                    return (
                        // eslint-disable-next-line lodash/prefer-matches
                        cachedImageDataInList.src === props.src &&
                        cachedImageDataInList.width === props.width &&
                        cachedImageDataInList.height === props.height
                    );
                }
            ) || null;

        if (cachedImageData === null) {
            console.error('can not find cached image for', props.src);
            return props.src;
        }

        return cachedImageData.blobUrl;
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return (
            <img
                style={{width: props.width, height: props.height}}
                src={view.getSrc()}
                className={style.canvas + additionClass}
                alt=""
            />
        );
    }
}
