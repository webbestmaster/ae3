// @flow

/* global document */

import {initializeEnvironment} from './component/app/helper.js';
import React from 'react';
import {render} from 'react-dom';
import {App} from './component/app/c-app';
import {AppLoader, type LoadAppPassedMethodMapType} from './component/app-loader/c-app-loader';
import {ReduxStoreProvider} from './redux-store-provider/provider';

const wrapperNode = document.querySelector('.js-app-wrapper');

function loadApp(methodMap: LoadAppPassedMethodMapType) {
    initializeEnvironment(methodMap)
        .then(
            (): void => {
                console.log('Environment is initialized!');

                if (wrapperNode === null) {
                    return console.error('can not find nodeWrapper for render app');
                }

                render(<App/>, wrapperNode);

                return console.log('App started!');
            }
        )
        .catch((error: Error) => {
            console.error('error with initialize environment or app start');
            console.error(error);
        });
}

if (wrapperNode) {
    render(
        <ReduxStoreProvider>
            <AppLoader load={loadApp}/>
        </ReduxStoreProvider>,
        wrapperNode
    );
} else {
    console.error('can not find nodeWrapper for load app');
}
