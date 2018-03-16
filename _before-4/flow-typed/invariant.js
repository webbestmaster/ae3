/* global KeyValue */
declare module 'es6-promise' {
    declare module .exports: { polyfill(): void }
}

declare type KeyValue = { [key: string]: any }
