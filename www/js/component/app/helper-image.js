// @flow

/* global window, document, fetch, URL, IS_PRODUCTION */

import * as PIXI from 'pixi.js';
import {Queue} from '../../lib/queue/queue';
import type {LoadAppPassedMethodMapType} from '../app-loader/c-app-loader';
import {loadSteps} from './helper';

export type ScaledImageDataType = {|
    src: string,
    width: number,
    height: number,
    // base64Image: string,
    blobUrl: string,
|};

export const imageCache: Array<ScaledImageDataType> = [];

const imageList: Array<string> = [];
const loader = PIXI.loader;

const allImageReqContext = require.context('./../../', true, /\.png$/);

allImageReqContext.keys().forEach((fileName: string) => {
    const image = allImageReqContext(fileName);

    if (imageList.includes(image)) {
        console.log('duplicate image', image);
        return;
    }

    imageList.push(image);
});

async function loadImagesToTextures(
    imageListToLoad: Array<string>,
    methodMap: LoadAppPassedMethodMapType
): Promise<void> {
    methodMap.setItemProgress(loadSteps.loadingTextures.id, 0, imageListToLoad.length);

    return new Promise((resolve: () => void) => {
        imageListToLoad.forEach((imageToLoad: string) => {
            loader.add(imageToLoad);
        });

        loader.onProgress.add(() => {
            methodMap.increaseItem(loadSteps.loadingTextures.id);
            console.log('load one image');
        });

        loader.load(() => {
            methodMap.onLoadItem(loadSteps.loadingTextures.id);

            resolve();
        });
    });
}

function loadImage(src: string): Promise<Image | null> {
    return new Promise((resolve: (image: Image) => void, reject: () => void) => {
        const image = new Image();

        image.addEventListener(
            'load',
            () => {
                resolve(image);
            },
            false
        );

        image.addEventListener(
            'error',
            () => {
                console.error('can not load image');
                resolve(image);
            },
            false
        );

        image.src = src;
    }).catch(
        (error: Error): null => {
            console.error('can not load image');
            console.error(error);
            return null;
        }
    );
}

const pixiApplication = new PIXI.Application(1, 1, {
    view: document.createElement('canvas'),
    autoStart: false,
    clearBeforeRender: true,
    sharedTicker: false,
    sharedLoader: true,
    transparent: true,
    preserveDrawingBuffer: true,
    resolution: window.devicePixelRatio || 1,
});

// eslint-disable-next-line complexity, max-statements
async function scaleImage(src: string, multiple: number): Promise<ScaledImageDataType | null> {
    const image = await loadImage(src);

    if (image === null) {
        console.error('image is null');
        return null;
    }

    const {naturalWidth, naturalHeight} = image;
    const endWidth = naturalWidth * multiple;
    const endHeight = naturalHeight * multiple;

    const maxImageSideSize = 128;

    if (naturalWidth > maxImageSideSize || naturalHeight > maxImageSideSize) {
        console.log('too big for cache', src);
        return null;
    }

    // eslint-disable-next-line id-match
    /*
    if (!IS_PRODUCTION) {
        return {
            src,
            width: endWidth,
            height: endHeight,
            blobUrl: src
        };
    }
*/

    const {stage, renderer} = pixiApplication;

    stage.removeChild(stage.children[0]);

    renderer.resize(endWidth, endHeight);

    const sprite = PIXI.Sprite.fromImage(src);

    sprite.width = endWidth;
    sprite.height = endHeight;

    stage.addChild(sprite);

    pixiApplication.render();

    const base64Image = renderer.view.toDataURL();

    const imageBlob = await fetch(base64Image).then((res: Response): Promise<Blob> => res.blob());

    const blobUrl = URL.createObjectURL(imageBlob);

    return {
        src,
        width: endWidth,
        height: endHeight,
        blobUrl,
    };
}

export async function initImages(methodMap: LoadAppPassedMethodMapType): Promise<void> {
    await loadImagesToTextures(imageList, methodMap);

    const queue = new Queue();

    imageList.forEach((imageSrc: string) => {
        queue.push(
            async (): Promise<void> => {
                const imageScale1 = await scaleImage(imageSrc, 1);
                const imageScale2 = await scaleImage(imageSrc, 2);

                if (imageScale1 === null || imageScale2 === null) {
                    console.log('error with image scaling', imageSrc);
                    return;
                }

                console.log('image scaled');

                imageCache.push(imageScale1, imageScale2);
            }
        );
    });
}
