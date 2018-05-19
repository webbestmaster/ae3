// @flow

import {Rectangle, Texture} from 'pixi.js';

type ApplicationOptionsType = {|
    autoStart?: boolean,
    transparent?: boolean,
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
    fill?: string | [string, string], // color
    stroke?: string, // stroke color
    strokeThickness?: number,
    dropShadow?: boolean,
    dropShadowColor?: string,
    dropShadowBlur?: number,
    dropShadowAngle?: number,
    dropShadowDistance?: number,
    wordWrap?: boolean,
    wordWrapWidth?: number
};

type InteractionEventType = {|
    +data: {|
        +global: {|
            +x: number,
            +y: number
        |}
    |}
|};

type MouseEventNameType = 'click' | 'mousedown' | 'mouseup';
type TouchEventNameType = 'tap' | 'touchstart' | 'touchend';

declare module 'pixi.js' {
    declare export var settings: {|
        SCALE_MODE: 0 | 1
    |};

    declare class PixiObject {
        on(eventName: MouseEventNameType | TouchEventNameType, callback: (evt: InteractionEventType) => void): void,
        width: number,
        height: number,
        interactive: boolean,
        buttonMode: boolean,
        hitArea: Rectangle,
        position: {
            set(x: number, y: number): void
        };
        scale: {
            set(x: number, y: number): void
        };
        alpha: number,
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

    declare export class Rectangle extends PixiObject {
        constructor(number, number, number, number): Rectangle
    }

    declare export class TextStyle {
        constructor(initialData?: TextStyleConstructorType): TextStyle
    }

    declare export class Text extends PixiObject {
        constructor(text: string | number, style?: TextStyle): Text;
        text: string | number
    }

    declare export class Container extends PixiObject {
        constructor(): Container,
        addChild(pixiObject: PixiObject): void,
        removeChild(pixiObject: PixiObject): void
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
