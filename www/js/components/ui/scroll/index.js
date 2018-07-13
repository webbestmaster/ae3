// @flow

/* global window, requestAnimationFrame, Event */

/* eslint consistent-this: ["error", "view"] */

import React, {Component} from 'react';
import type {Node} from 'react';
import Swiper from 'swiper';
import classnames from 'classnames';
import swiperStyle from 'swiper/dist/css/swiper.min.css';
import style from './style.scss';

type StateType = void;
type PropsType = {|
    className?: string,
    children: Array<Node>
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
            // watchOverflow: true, // disable this cause swiper has scroll bar and bug after resize
            scrollbar: {
                el: '.swiper-scrollbar' // eslint-disable-line id-length
            },
            mousewheel: true
        });

        return new Promise((resolve: () => void) => {
            // need to fix swiper size
            requestAnimationFrame(() => {
                window.dispatchEvent(new Event('resize'));
                resolve();
            });
        });
    }

    componentDidMount() {
        const view = this;

        view.initSwiper()
            .then(() => {
                console.log('swiper initialized');
            });
    }

    renderSwiper(): Node {
        const view = this;
        const {props} = view;

        return (
            <div
                className={classnames(swiperStyle['swiper-container'], style.swiper_container)}
                ref={(wrapper: HTMLElement | null) => {
                    view.node.wrapper = wrapper;
                }}
            >
                <div className={classnames(swiperStyle['swiper-wrapper'], style.swiper_wrapper)}>
                    <div className={classnames(swiperStyle['swiper-slide'], style.swiper_slide)}>
                        {props.children}
                    </div>
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
                <div className={style.container}>
                    {view.renderSwiper()}
                </div>
            </div>
        );
    }
}
