// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {LangKeyType} from '../locale/translation/type';

type PassedPropsType = {|
    +load: () => void
|};

type LoadItemType = {|
    +id: string,
    langKeyName: LangKeyType,
    current: number,
    full: number
|};

type StateType = {|
    +items: Array<LoadItemType>
|};

type LoadAppPassedMethodMapType = {|
    addItem(itemId: string, langKeyName: LangKeyType): void,
    setItemProgress(itemId: string, current: number, full: number): void,
    increaseItem(itemId: string): void,
    onLoadItem(itemId: string): void,
    onErrorItem(itemId: string): void
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
            }
        };
    }

    getItemById(itemId: string): LoadItemType | null {
        const view = this;
        const {state} = view;
        const {items} = state;

        return items.find((loadItem: LoadItemType): boolean => loadItem.id === itemId) || null;
    }

    addItem(itemId: string, langKeyName: LangKeyType) {}

    setItemProgress(itemId: string, current: number, full: number) {}

    increaseItem(itemId: string) {}

    onLoadItem(itemId: string) {}

    onErrorItem(itemId: string) {}

    renderItem(loadItem: LoadItemType): Node {
        return <div>{JSON.stringify(loadItem)}</div>;
    }

    render(): Node {
        const view = this;
        const {state} = view;
        const {items} = state;

        return <div>{items.map((loadItem: LoadItemType): Node => view.renderItem(loadItem))}</div>;
    }
}
