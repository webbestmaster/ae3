// @flow

/* eslint consistent-this: ["error", "view"] */

/* global window, setTimeout */

import React, {Component, Fragment} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import type {HideSnackBarEventDetailType, ShowSnackBarEventDetailType} from './action';
import style from './style.scss';

const fadeTimeOut = 300;

const fadeClassNames = {
    enter: style.fade__enter,
    enterActive: style.fade__enter__active,
    exit: style.fade__exit,
};

type PassedPropsType = {|
    +eventName: string | number,
|};

type PropsType = PassedPropsType;

type StateType = {|
    +list: Array<ShowSnackBarEventDetailType>,
|};

export class SnackBar extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {
            list: [],
        };
    }

    handleEvent = ({detail}: {detail: ShowSnackBarEventDetailType | HideSnackBarEventDetailType}): void => {
        return detail.isShow ? this.addSnackBar(detail) : this.removeSnackBar(detail.id);
    };

    addSnackBar = (detail: ShowSnackBarEventDetailType) => {
        const {state} = this;
        const {list} = state;

        const isAlreadyExists = Boolean(
            list.find((snackBarData: ShowSnackBarEventDetailType): boolean => snackBarData.id === detail.id)
        );

        if (isAlreadyExists) {
            console.log('Notification ---> Item already exists!');
            console.log(detail);
            return;
        }

        list.push(detail);

        // eslint-disable-next-line react/no-set-state
        this.setState({list});

        setTimeout((): void => this.removeSnackBar(detail.id), detail.timer);
    };

    removeSnackBar = (snackBarId: string | number) => {
        const {state} = this;
        const {list} = state;

        const snackBar =
            list.find((snackBarData: ShowSnackBarEventDetailType): boolean => snackBarData.id === snackBarId) || null;

        if (snackBar === null) {
            console.log('Notification ---> Item is NOT exists!');
            console.log(snackBarId);
            return;
        }

        list.splice(list.indexOf(snackBar), 1);

        // eslint-disable-next-line react/no-set-state
        this.setState({list});
    };

    bindEventListener() {
        const {props} = this;

        window.addEventListener(props.eventName, this.handleEvent, false);
    }

    removeEventListener() {
        const {props} = this;

        window.removeEventListener(props.eventName, this.handleEvent, false);
    }

    componentDidMount() {
        this.bindEventListener();
    }

    componentWillUnmount() {
        this.removeEventListener();
    }

    // eslint-disable-next-line id-match
    renderListItem = (itemData: ShowSnackBarEventDetailType): React$Node => {
        return (
            <CSSTransition
                onExited={itemData.handleOnHide}
                key={itemData.id}
                timeout={fadeTimeOut}
                classNames={fadeClassNames}
            >
                {itemData.content}
            </CSSTransition>
        );
    };

    // eslint-disable-next-line id-match
    renderScreenDisable(): React$Node {
        const {list} = this.state;

        const hasModelSnackBar = list.some((itemData: ShowSnackBarEventDetailType): boolean => itemData.isModal);

        if (hasModelSnackBar === false) {
            return null;
        }

        return (
            <CSSTransition key="screen-disable" timeout={fadeTimeOut} classNames={fadeClassNames}>
                <div className={style.screen_disable}/>
            </CSSTransition>
        );
    }

    // eslint-disable-next-line id-match
    render(): React$Node {
        const {list} = this.state;

        return (
            <>
                <TransitionGroup>{this.renderScreenDisable()}</TransitionGroup>
                <TransitionGroup className={style.list_wrapper}>{list.map(this.renderListItem)}</TransitionGroup>
            </>
        );
    }
}
