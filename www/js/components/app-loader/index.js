// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {LangKeyType} from '../locale/translation/type';

export type LoadAppPassedMethodMapType = {|
    addItem(itemId: string, langKeyName: LangKeyType): void,
    setItemProgress(itemId: string, current: number, full: number): void,
    increaseItem(itemId: string): void,
    onLoadItem(itemId: string): void,
    onErrorItem(itemId: string): void,
    onWarningItem(itemId: string): void
|};

type PassedPropsType = {|
    +load: (methodMap: LoadAppPassedMethodMapType) => void
|};

type LoadItemType = {|
    +id: string,
    +langKeyName: LangKeyType,
    current: number,
    full: number,
    isLoad: boolean,
    hasError: boolean,
    hasWarning: boolean
|};

type StateType = {|
    +items: Array<LoadItemType>
|};

export default class AppLoader extends Component<PassedPropsType, StateType> {
    props: PassedPropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            items: []
        };
    }

    componentDidMount() {
        const view = this;
        const {props} = view;

        props.load(view.getPassedMethodMap());
    }

    getPassedMethodMap(): LoadAppPassedMethodMapType {
        const view = this;

        return {
            addItem: (itemId: string, langKeyName: LangKeyType) => {
                view.addItem(itemId, langKeyName);
            },
            setItemProgress: (itemId: string, current: number, full: number) => {
                view.setItemProgress(itemId, current, full);
            },
            increaseItem: (itemId: string) => {
                view.increaseItem(itemId);
            },
            onLoadItem: (itemId: string) => {
                view.onLoadItem(itemId);
            },
            onErrorItem: (itemId: string) => {
                view.onErrorItem(itemId);
            },
            onWarningItem: (itemId: string) => {
                view.onWarningItem(itemId);
            }
        };
    }

    getItemById(itemId: string): LoadItemType | null {
        const view = this;
        const {state} = view;
        const {items} = state;

        return items.find((loadItem: LoadItemType): boolean => loadItem.id === itemId) || null;
    }

    addItem(itemId: string, langKeyName: LangKeyType) {
        const view = this;
        const {state} = view;
        const {items} = state;

        const oldItem = view.getItemById(itemId);

        if (oldItem !== null) {
            console.error('Item with id', itemId, 'already exists');
            return;
        }

        items.push({
            id: itemId,
            langKeyName,
            current: 0,
            full: 0,
            isLoad: false,
            hasError: false,
            hasWarning: false
        });

        view.setState({items: [...items]});
    }

    setItemProgress(itemId: string, current: number, full: number) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error('Item with id', itemId, 'NO exists');
            return;
        }

        item.current = current;
        item.full = full;

        view.setState({...state});
    }

    increaseItem(itemId: string) {
        const view = this;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error('Item with id', itemId, 'NO exists');
            return;
        }

        view.setItemProgress(itemId, item.current + 1, item.full);
    }

    onLoadItem(itemId: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error('Item with id', itemId, 'NO exists');
            return;
        }

        item.isLoad = true;

        view.setState({...state});
    }

    onErrorItem(itemId: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error('Item with id', itemId, 'NO exists');
            return;
        }

        item.hasError = true;

        view.setState({...state});
    }

    onWarningItem(itemId: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error('Item with id', itemId, 'NO exists');
            return;
        }

        item.hasWarning = true;

        view.setState({...state});
    }

    renderItem(loadItem: LoadItemType): Node {
        return (
            <div key={loadItem.id}>
                {loadItem.id} {loadItem.current}
                {'/'}
                {loadItem.full}
                <br/>
                {'isLoad ' + loadItem.isLoad.toString()}
                <br/>
                {'hasWarning ' + loadItem.hasWarning.toString()}
                <br/>
                {'hasError ' + loadItem.hasError.toString()}
                <br/>
                <br/>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {state} = view;
        const {items} = state;

        return <div>{items.map((loadItem: LoadItemType): Node => view.renderItem(loadItem))}</div>;
    }
}
