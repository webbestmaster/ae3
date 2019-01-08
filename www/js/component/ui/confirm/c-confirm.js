// @flow

/* global window */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import type {GetConfirmDetailType} from './action';
import {defaultEventName} from './action';
import {Dialog} from '../dialog/c-dialog';
import style from './style.scss';
import type {LangKeyType} from '../../locale/translation/type';
import {Locale} from '../../locale/c-locale';

type PropsType = {|
    eventName?: string,
|};

type StateType = {|
    +isOpen: boolean,
    +id: number,
    // eslint-disable-next-line id-match
    +content: React$Node,
    +applyCallBack: () => mixed,
    +cancelCallBack: () => mixed,
|};

export class Confirm extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            isOpen: false,
            content: '',
            id: Math.random(),
            applyCallBack: (): null => null,
            cancelCallBack: (): null => null,
        };
    }

    handleEvent = ({detail}: {detail: GetConfirmDetailType}) => {
        const view = this;
        const {state} = view;

        // cancel prev callback
        state.applyCallBack();

        const isOpen = Boolean(detail.content);

        // eslint-disable-next-line react/no-set-state
        view.setState({isOpen});

        if (isOpen) {
            // eslint-disable-next-line react/no-set-state
            view.setState({
                content: detail.content,
                applyCallBack: detail.applyCallBack,
                cancelCallBack: detail.cancelCallBack,
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

    handleApplyCallBack = async () => {
        const view = this;
        const {state} = view;
        const {applyCallBack} = state;

        applyCallBack();

        view.close();
    };

    handleCancelCallBack = async () => {
        const view = this;
        const {state} = view;
        const {cancelCallBack} = state;

        cancelCallBack();

        view.close();
    };

    render(): Node {
        const view = this;
        const {state} = view;
        const {content, isOpen} = state;

        return (
            <Dialog isOpen={isOpen} key={state.id}>
                {content}
                <div className={style.dialog_action_wrapper}>
                    <button
                        className={style.dialog_action_button}
                        type="button"
                        onKeyPress={view.handleApplyCallBack}
                        onClick={view.handleApplyCallBack}
                    >
                        <Locale stringKey={('DIALOG_CONFIRM_APPLY': LangKeyType)}/>
                    </button>
                    <button
                        className={style.dialog_action_button}
                        type="button"
                        onKeyPress={view.handleCancelCallBack}
                        onClick={view.handleCancelCallBack}
                    >
                        <Locale stringKey={('DIALOG_CONFIRM_CANCEL': LangKeyType)}/>
                    </button>
                </div>
            </Dialog>
        );
    }
}
