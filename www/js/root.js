// @flow
/* global window */

import {initializeEnvironment} from './component/app/helper.js';
import React from 'react';
import {render} from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
// import {StoreProvider} from './component/store/provider';
import muiTheme from './component/ui/mui-theme/mui-theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import App from './component/app/c-app';
import AppLoader, {type LoadAppPassedMethodMapType} from './component/app-loader/c-app-loader';

import * as reducers from './redux-store-provider/app-reducer';

console.log('Environment is initialized!');

const reducer = combineReducers({
    ...reducers
});

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const wrapperNode = window.document.querySelector('.js-app-wrapper');

function loadApp(methodMap: LoadAppPassedMethodMapType) {
    initializeEnvironment(methodMap)
        .then(
            (): void => {
                console.log('Environment is initialized!');

                /* eslint-disable react/jsx-max-depth */
                render(
                    <Provider store={store}>
                        <BrowserRouter>
                            {/* <StoreProvider>*/}
                            <MuiThemeProvider theme={muiTheme}>
                                <App/>
                            </MuiThemeProvider>
                            {/* </StoreProvider>*/}
                        </BrowserRouter>
                    </Provider>,
                    wrapperNode
                );
                /* eslint-enable react/jsx-max-depth */

                return console.log('App started!');
            }
        )
        .catch((error: Error) => {
            console.error('error with initialize environment or app start');
            console.error(error);
        });
}

render(
    <Provider store={store}>
        <BrowserRouter>
            <AppLoader load={loadApp}/>
        </BrowserRouter>
    </Provider>,
    wrapperNode
);
