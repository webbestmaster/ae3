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
    declare class Sprite {
        constructor(): Sprite;
        static fromImage(spriteName: string): Sprite
    }

    declare class Stage {
        constructor(): Stage;
        addChild(sprite: Sprite): void
    }

    declare class Application {
        constructor(width: number, height: number, options?: ApplicationOptionsType): Application;
        view: HTMLElement;
        stage: Stage;
        renderer: {
            resize(width: number, height: number): void
        }
    }
}
