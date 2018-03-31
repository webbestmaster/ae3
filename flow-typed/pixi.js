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

type TextStyleConstructorType = {
    fontFamily?: string,
    fontSize?: number,
    fontStyle?: 'normal' | 'italic',
    fontWeight?: 'normal' | 'bold',
    fill?: string | [string, string],
    stroke?: string,
    strokeThickness?: number,
    dropShadow?: boolean,
    dropShadowColor?: string,
    dropShadowBlur?: number,
    dropShadowAngle?: number,
    dropShadowDistance?: number,
    wordWrap?: boolean,
    wordWrapWidth?: number
};

declare module 'pixi.js' {
    declare export var settings: {|
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
        };
        removeChildren(startIndex?: number, endIndex?: number): void
    }

    declare export class Texture {
        constructor(): Texture;
        static fromImage(spriteName: string): Texture
    }

    declare export class Sprite extends PixiObject {
        constructor(): Sprite;
        static fromImage(spriteName: string): Sprite
    }

    declare export class TextStyle {
        constructor(initialData?: TextStyleConstructorType): TextStyle
    }

    declare export class Text extends PixiObject {
        constructor(text: string | number, style?: TextStyle): Text;
        text: string | number
    }

    declare export class Container extends PixiObject {
        constructor(): Container;
        addChild(pixiObject: PixiObject): void
    }

    declare export class Application {
        constructor(width: number, height: number, options?: ApplicationOptionsType): Application;
        view: HTMLElement;
        stage: Container;
        renderer: {
            resize(width: number, height: number): void
        }
    }

    declare class AnimatedSprite extends PixiObject {
        constructor(textureList: Array<Texture>): AnimatedSprite;
        animationSpeed: number;
        play(): void
    }

    declare export var extras: {
        AnimatedSprite: typeof AnimatedSprite
    }
}
