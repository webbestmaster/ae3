// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import type {ShowPopupDetailType} from './action';
import {defaultEventName} from './action';
import {Dialog} from '../dialog/c-dialog';

type PropsType = {|
    eventName?: string,
|};

type StateType = {|
    +isOpen: boolean,
    +id: number,
    // eslint-disable-next-line id-match
    +content: React$Node,
    +hideCallBack: () => void,
|};

export class Popup extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            isOpen: false,
            content: '',
            id: Math.random(),
            // eslint-disable-next-line lodash/prefer-noop
            hideCallBack: () => {},
        };
    }

    handleEvent = ({detail}: {detail: ShowPopupDetailType}) => {
        const view = this;
        const {state} = view;

        // cancel prev callback
        state.hideCallBack();

        const isOpen = Boolean(detail.content);

        // eslint-disable-next-line react/no-set-state
        view.setState({isOpen});

        if (isOpen) {
            // eslint-disable-next-line react/no-set-state
            view.setState({
                content: detail.content,
                hideCallBack: detail.hideCallBack,
            });
        }
    };

    bindEventListener() {
        const view = this;
        const {props} = view;
        const {eventName} = props;
        const resultEventName = typeof eventName === 'string' ? eventName : defaultEventName;

        window.addEventListener(resultEventName, view.handleEvent, false);
    }

    removeEventListener() {
        const view = this;
        const {props} = view;
        const {eventName} = props;
        const resultEventName = typeof eventName === 'string' ? eventName : defaultEventName;

        window.removeEventListener(resultEventName, view.handleEvent, false);
    }

    componentDidMount() {
        const view = this;

        view.bindEventListener();
    }

    componentWillUnmount() {
        const view = this;

        view.close();
        view.removeEventListener();
    }

    close() {
        const view = this;

        // eslint-disable-next-line react/no-set-state
        view.setState({isOpen: false});
    }

    handleHideCallBack = async (): Promise<void> => {
        const view = this;
        const {state} = view;
        const {hideCallBack} = state;

        hideCallBack();

        view.close();
    };

    render(): Node {
        const view = this;
        const {state} = view;
        const {content, isOpen} = state;

        return (
            <Dialog isOpen={isOpen} key={state.id} onClick={view.handleHideCallBack} hasCloseButton>
                {/*
                <button type="button" onClick={view.handleHideCallBack} onKeyPress={view.handleHideCallBack}>
                    close
                </button>
*/}
                {content}
            </Dialog>
        );
    }
}
