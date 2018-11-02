// @flow

import type {Node} from 'react';
import React from 'react';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import * as reducers from './reducer';

type PassedPropsType = $Exact<{
    +children: Node,
}>;

const reducer = combineReducers({
    ...reducers,
});

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export function ReduxStoreProvider(props: PassedPropsType): Node {
    const {children} = props;

    return <Provider store={store}>{children}</Provider>;
}
