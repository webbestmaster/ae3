// @flow

/* global window, requestAnimationFrame, Event */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import Swiper from 'swiper';
import classnames from 'classnames';
import style from './style.scss';

type StateType = void;
type PropsType = {|
    className?: string,
    children: Node | Array<Node>
|};
type NodeType = {|
    wrapper: HTMLElement | null
|};

type AttrType = {|
    swiper: Swiper | null
|};

export default class Scroll extends Component<StateType, PropsType> {
    state: StateType;
    props: PropsType;
    node: NodeType;
    attr: AttrType;

    constructor() {
        super();

        const view = this;

        view.node = {
            wrapper: null
        };

        view.attr = {
            swiper: null
        };
    }

    async initSwiper(): Promise<void> {
        const view = this;

        const {wrapper} = view.node;

        if (wrapper === null) {
            return Promise.resolve();
        }

        view.attr.swiper = new Swiper(wrapper, {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            watchOverflow: true, // disable this cause swiper has scroll bar and bug after resize
            scrollbar: {
                // eslint-disable-next-line id-length
                el: '.swiper-scrollbar'
            },
            mousewheel: true
        });

        return view.recount();
    }

    componentDidMount() {
        const view = this;

        view.initSwiper()
            .then((): void => console.log('swiper initialized'))
            .catch((error: Error) => {
                console.error('error with view.initSwiper()');
                console.error(error);
            });
    }

    componentDidUpdate() {
        const view = this;

        view.recount()
            .then((): void => console.log('swiper recounted'))
            .catch((error: Error) => {
                console.error('error with swiper recounted');
                console.error(error);
            });
    }

    async recount(): Promise<void> {
        return new Promise((resolve: () => void) => {
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
                requestAnimationFrame(resolve);
            });
        });
    }

    renderSwiper(): Node {
        const view = this;
        const {props} = view;

        return (
            <div
                className={classnames('swiper-container', style.swiper_container)}
                ref={(wrapper: HTMLElement | null) => {
                    view.node.wrapper = wrapper;
                }}
            >
                <div className={classnames('swiper-wrapper', style.swiper_wrapper)}>
                    <div className={classnames('swiper-slide', style.swiper_slide)}>{props.children}</div>
                </div>
                <div className="swiper-scrollbar"/>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {props} = view;

        return (
            <div className={classnames(style.wrapper, props.className)}>
                <div className={style.container}>{view.renderSwiper()}</div>
            </div>
        );
    }
}