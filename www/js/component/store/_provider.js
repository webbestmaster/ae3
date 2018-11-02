// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';

type StoreValueStateType = {|
    +openFromGame: boolean
|};

type StoreValueActionType = {|
    setOpenFromGame: (openFromGame: boolean) => void,
    getState: () => StoreValueStateType
|};

export type StoreValueType = {|
    +state: StoreValueStateType,
    +action: StoreValueActionType
|};

const defaultState: StoreValueStateType = {
    openFromGame: false,
};

const defaultAction: StoreValueActionType = {
    setOpenFromGame: (openFromGame: boolean) => {
        console.error('method not \'override\' yet');
    },
    getState: (): StoreValueStateType => defaultState,
};

const defaultContextData: StoreValueType = {
    state: defaultState,
    action: defaultAction,
};

const {Provider, Consumer} = React.createContext(defaultContextData);

const storeAction: StoreValueActionType = defaultContextData.action;

class StoreProvider extends Component {
    state: StoreValueStateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            openFromGame: false,
        };

        // storeAction.setOpenFromGame = (openFromGame: boolean): void => view.setOpenFromGame(openFromGame);
        // storeAction.getState = (): StoreValueStateType => view.state;
    }

    getValue(): StoreValueType {
        const view = this;
        const {state} = view;

        return {
            state,
            action: {
                setOpenFromGame: (openFromGame: boolean): void => view.setOpenFromGame(openFromGame),
                getState: (): StoreValueStateType => this.state,
            },
        };
    }

    setOpenFromGame(openFromGame: boolean) {
        const view = this;

        view.setState({openFromGame});
    }

    render(): Node {
        const view = this;
        const {props} = view;
        const {children} = props;

        return <Provider value={view.getValue()}>{children}</Provider>;
    }
}

export {storeAction};
