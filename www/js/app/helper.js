// @flow

/* global window, document, Image, setTimeout, requestAnimationFrame */

import FastClick from 'fastclick';
import TWEEN from '@tweenjs/tween.js';

import {run as runLocalServer} from '../module/server-local-api';
import {run as runLocalSocket} from '../module/socket-local';
import {initImages} from './helper-image';
import {socket} from '../module/socket';
import type {LoadAppPassedMethodMapType} from '../components/app-loader/c-app-loader';
import type {LangKeyType} from '../components/locale/translation/type';

type LoadStepsType = {
    +[key: string]: {|
        +id: string,
        +langKey: LangKeyType
    |}
};

export const loadSteps: LoadStepsType = {
    environmentSetting: {
        id: 'environment setting',
        langKey: 'ENVIRONMENT_SETTING'
    },
    settingUpConnections: {
        id: 'setting up connections',
        langKey: 'SETTING_UP_CONNECTIONS'
    },
    loadingTextures: {
        id: 'loading textures',
        langKey: 'LOADING_TEXTURES'
    },
    preparationOfImages: {
        id: 'preparation of images',
        langKey: 'PREPARATION_OF_IMAGES'
    }
};

// eslint-disable-next-line max-statements
export async function initializeEnvironment(methodMap: LoadAppPassedMethodMapType): Promise<void> {
    const {body} = document;

    // add all loaders
    methodMap.addItem(loadSteps.environmentSetting.id, loadSteps.environmentSetting.langKey);
    methodMap.setItemProgress(loadSteps.environmentSetting.id, 0, 4);

    methodMap.addItem(loadSteps.settingUpConnections.id, loadSteps.settingUpConnections.langKey);
    methodMap.setItemProgress(loadSteps.settingUpConnections.id, 0, 3);

    methodMap.addItem(loadSteps.loadingTextures.id, loadSteps.loadingTextures.langKey);
    // methodMap.addItem(loadSteps.preparationOfImages.id, loadSteps.preparationOfImages.langKey);

    if (body !== null) {
        // reduce 300ms delay
        FastClick.attach(body);
    } else {
        methodMap.onErrorItem(loadSteps.environmentSetting.id, 'document.body is not define');
        console.error('document.body is not define');
    }

    methodMap.increaseItem(loadSteps.environmentSetting.id);

    // run Tween.js updater
    (function animate() {
        window.requestAnimationFrame(animate);
        TWEEN.update();
    })();

    methodMap.increaseItem(loadSteps.environmentSetting.id);

    // disable gesture zoom on iOS
    document.addEventListener('gesturestart', (evt: Event) => {
        evt.preventDefault();
    });

    methodMap.increaseItem(loadSteps.environmentSetting.id);

    // disable extra scroll on iOS, use Scroll component
    document.addEventListener(
        'touchmove',
        (evt: Event) => {
            evt.preventDefault();
        },
        false
    );

    methodMap.increaseItem(loadSteps.environmentSetting.id);
    methodMap.onLoadItem(loadSteps.environmentSetting.id);

    await runLocalServer()
        .then((): void => console.log('Local Server has been run.'))
        .catch((error: Error) => {
            methodMap.onErrorItem(loadSteps.settingUpConnections.id, 'Local Server has NOT been run.');
            console.log('Local Server has NOT been run.');
            console.error(error);
        });
    methodMap.increaseItem(loadSteps.settingUpConnections.id);

    await runLocalSocket()
        .then((): void => console.log('Local Socket has been connect.'))
        .catch((error: Error) => {
            methodMap.onErrorItem(loadSteps.settingUpConnections.id, 'Local Socket has NOT been connect.');
            console.log('Local Socket has NOT been connect.');
            console.error(error);
        });
    methodMap.increaseItem(loadSteps.settingUpConnections.id);

    await socket
        .initSocket()
        .then((): void => console.log('Socket has been connect.'))
        .catch((error: Error) => {
            methodMap.onErrorItem(loadSteps.settingUpConnections.id, 'Socket has NOT been connect.');
            console.log('Socket has NOT been connect.');
            console.error(error);
        });
    methodMap.increaseItem(loadSteps.settingUpConnections.id);

    methodMap.onLoadItem(loadSteps.settingUpConnections.id);

    await initImages(methodMap);
}
