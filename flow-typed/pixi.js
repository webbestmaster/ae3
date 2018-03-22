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
    declare class PixiObject {
        position: {
            set(x: number, y: number): void
        };
        scale: {
            set(x: number, y: number): void
        }
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
}
