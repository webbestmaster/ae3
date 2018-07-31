// @flow

/* global window, document */

import * as PIXI from 'pixi.js';
import Queue from '../lib/queue';

export type ScaledImageDataType = {|
    width: number,
    height: number,
    base64Image: string,
    src: string
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

async function loadImagesToTextures(imageListToLoad: Array<string>): Promise<void> {
    return new Promise((resolve: () => void) => {
        imageListToLoad.forEach((imageToLoad: string) => {
            loader.add(imageToLoad);
        });

        loader.onProgress.add(() => {
            console.log('load one image');
        });

        loader.load(resolve);
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
    resolution: window.devicePixelRatio || 1
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

    const {stage, renderer} = pixiApplication;

    stage.removeChild(stage.children[0]);

    renderer.resize(endWidth, endHeight);

    const sprite = PIXI.Sprite.fromImage(src);

    sprite.width = endWidth;
    sprite.height = endHeight;

    stage.addChild(sprite);

    pixiApplication.render();

    return {
        src,
        width: endWidth,
        height: endHeight,
        base64Image: renderer.view.toDataURL()
    };
}

export async function initImages(): Promise<void> {
    await loadImagesToTextures(imageList);

    const queue = new Queue();

    await new Promise((resolve: () => void) => {
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
        queue.push(resolve);
    });
}
