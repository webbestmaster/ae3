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

type StateType = void;

export class Canvas extends Component<PassedPropsType, StateType> {
    props: PassedPropsType;
    state: StateType;

    getSrc(): string {
        const view = this;
        const {props} = view;
        const {src, width, height} = props;

        const cachedImageData =
            imageCache.find(
                (cachedImageDataInList: ScaledImageDataType): boolean => {
                    return (
                        // eslint-disable-next-line lodash/prefer-matches
                        cachedImageDataInList.src === src &&
                        cachedImageDataInList.width === width &&
                        cachedImageDataInList.height === height
                    );
                }
            ) || null;

        if (cachedImageData === null) {
            console.error('can not find cached image for', src);
            return src;
        }

        return cachedImageData.blobUrl;
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {width, height} = props;

        const additionClass = isString(props.className) ? ' ' + props.className : '';

        return <img style={{width, height}} src={view.getSrc()} className={style.canvas + additionClass} alt=""/>;
    }
}
