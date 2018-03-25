// @flow

type ApplicationOptionsType = {|
    autoStart?: boolean,
    backgroundColor?: number,
    view?: HTMLElement,
    resolution?: number,
    clearBeforeRender?: boolean,
    sharedTicker?: boolean,
    sharedLoader?: boolean
|};

declare module 'pixi.js' {
    declare var settings: {|
        SCALE_MODE: 0 | 1
    |};

    declare class PixiObject {
        on(string: 'click', callback: () => void): void,
        interactive: boolean,
        buttonMode: boolean,
        position: {
            set(x: number, y: number): void
        };
        scale: {
            set(x: number, y: number): void
        }
    }

    declare class Texture {
        constructor(): Texture;
        static fromImage(spriteName: string): Texture
    }

    declare class Sprite extends PixiObject {
        constructor(): Sprite;
        static fromImage(spriteName: string): Sprite
    }

    declare class Container extends PixiObject {
        constructor(): Container;
        addChild(pixiObject: PixiObject): void
    }

    declare class Application {
        constructor(width: number, height: number, options?: ApplicationOptionsType): Application;
        view: HTMLElement;
        stage: Container;
        renderer: {
            resize(width: number, height: number): void
        }
    }

    declare class AnimatedSprite extends PixiObject {
        constructor(textureList: Array<Texture>): AnimatedSprite;
        animationSpeed: number
    }

    declare var extras: {}
}


/*
    declare module.exports: {
        extras: {
            declare class AnimatedSprite extends PixiObject {
            constructor(textureList: Array<Texture>): AnimatedSprite;
            animationSpeed: number;
            }

        }


    }
*/

// declare module extras {
// }
