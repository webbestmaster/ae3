// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import style from './style.scss';
import type {LangKeyType} from '../locale/translation/type';
import {Page} from '../ui/page/c-page';
import serviceStyle from '../../../css/service.scss';
// import {Home} from '../../page/home';
import ButtonListWrapper from '../ui/button-list-wrapper/c-button-list-wrapper';
import buttonListWrapperStyle from '../ui/button-list-wrapper/style.scss';
import {Locale} from '../locale/c-locale';
import logoSrc from '../../page/home/i/logo.png';
import homeStyle from '../../page/home/style.scss';

export type LoadAppPassedMethodMapType = {|
    addItem(itemId: string, langKeyName: LangKeyType): void,
    setItemProgress(itemId: string, current: number, full: number): void,
    increaseItem(itemId: string): void,
    onLoadItem(itemId: string): void,
    onErrorItem(itemId: string, errorMessage: string): void,
    onWarningItem(itemId: string, warningMessage: string): void
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
    warningList: Array<string>,
    errorList: Array<string>
|};

type StateType = {|
    +items: Array<LoadItemType>
|};

const itemWithid = 'Item with id';

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
            onErrorItem: (itemId: string, errorMessage: string) => {
                view.onErrorItem(itemId, errorMessage);
            },
            onWarningItem: (itemId: string, warningMessage: string) => {
                view.onWarningItem(itemId, warningMessage);
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
            console.error(itemWithid, itemId, 'already exists');
            return;
        }

        items.push({
            id: itemId,
            langKeyName,
            current: 0,
            full: 0,
            isLoad: false,
            warningList: [],
            errorList: []
        });

        view.setState({items: [...items]});
    }

    setItemProgress(itemId: string, current: number, full: number) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error(itemWithid, itemId, 'NO exists');
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
            console.error(itemWithid, itemId, 'NO exists');
            return;
        }

        view.setItemProgress(itemId, item.current + 1, item.full);
    }

    onLoadItem(itemId: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error(itemWithid, itemId, 'NO exists');
            return;
        }

        item.isLoad = true;

        view.setState({...state});
    }

    onErrorItem(itemId: string, errorMessage: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error(itemWithid, itemId, 'NO exists');
            return;
        }

        item.errorList.push(errorMessage);

        view.setState({...state});
    }

    onWarningItem(itemId: string, warningMessage: string) {
        const view = this;
        const {state} = view;

        const item = view.getItemById(itemId);

        if (item === null) {
            console.error(itemWithid, itemId, 'NO exists');
            return;
        }

        item.warningList.push(warningMessage);

        view.setState({...state});
    }

    renderItem(loadItem: LoadItemType): Node {
        const progressString = (loadItem.full === 0 ? '?/?' : loadItem.current + '/' + loadItem.full).padEnd(
            7,
            '\u00A0'
        );

        const progressValue = loadItem.full === 0 ? 0 : loadItem.current / loadItem.full * 100;

        return (
            <div className={style.load_item} key={loadItem.id}>
                <p className={style.load_item__header}>
                    <Locale stringKey={loadItem.langKeyName}/>
                    {':\u00A0'}
                    {progressString}
                </p>
                <div className={style.progress_bar__wrapper}>
                    <div className={style.progress_bar__container}>
                        <div className={style.progress_bar__line} style={{width: progressValue + '%'}}/>
                    </div>
                    <p className={style.progress_bar__percent_value}>
                        {Math.floor(progressValue)
                            .toString(10)
                            .padStart(3, '\u00A0')}
                        %
                    </p>
                </div>

                {/*
                {loadItem.id} {loadItem.current}
                {'/'}
                {loadItem.full}
                <br/>
                {'isLoad ' + loadItem.isLoad.toString()}
                <br/>
                {'warningList size' + loadItem.warningList.length}
                <br/>
                {'errorList size' + loadItem.errorList.length}
                <br/>
                <br/>
*/}
            </div>
        );
    }

    static renderPartLogo(): Node {
        return (
            <div className={serviceStyle.two_blocks_container}>
                &nbsp;&nbsp;Build of&nbsp;
                {new Date(BUILD_DATE).toLocaleString()}
                <img src={logoSrc} className={homeStyle.logo} alt=""/>
            </div>
        );
    }

    renderPartLoadersList(): Node {
        const view = this;
        const {state} = view;
        const {items} = state;

        return (
            <div className={serviceStyle.two_blocks_container}>
                <ButtonListWrapper className={buttonListWrapperStyle.button_list_wrapper_single}>
                    <div>{items.map((loadItem: LoadItemType): Node => view.renderItem(loadItem))}</div>
                </ButtonListWrapper>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {state} = view;
        const {items} = state;

        return (
            <Page>
                <div className={serviceStyle.two_blocks_wrapper}>
                    {AppLoader.renderPartLogo()}
                    {view.renderPartLoadersList()}
                </div>
            </Page>
        );
    }
}
