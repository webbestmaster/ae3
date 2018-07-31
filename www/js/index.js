// @flow
/* global window */

import {initializeEnvironment} from './app/helper.js';
import React from 'react';
import {render} from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import {StoreProvider} from './components/store/provider';
import muiTheme from './components/ui/mui-theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import App from './app';

import * as reducers from './app-reducer';

initializeEnvironment()
    .then(
        (): void => {
            console.log('Environment is initialized!');

            const reducer = combineReducers({
                ...reducers
            });

            const composeEnhancers = composeWithDevTools({
                // options like actionSanitizer, stateSanitizer
            });

            const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

            /* eslint-disable react/jsx-max-depth */
            render(
                <Provider store={store}>
                    <BrowserRouter>
                        <StoreProvider>
                            <MuiThemeProvider theme={muiTheme}>
                                <App/>
                            </MuiThemeProvider>
                        </StoreProvider>
                    </BrowserRouter>
                </Provider>,
                window.document.querySelector('.js-app-wrapper')
            );
            /* eslint-enable react/jsx-max-depth */

            return console.log('App started!');
        }
    )
    .catch((error: Error) => {
        console.error('error with initialize environment or app start');
        console.error(error);
    });
