// @flow

declare module 'main-model' {
    declare export default class MainModel {
    constructor(defaultData?: mixed): MainModel,
        // eslint-disable-next-line flowtype/no-weak-types
    listenTo(what: MainModel, key: string, callback: (value?: any, value?: any) => any): MainModel,
    stopListening(): MainModel,
    destroy(): MainModel,
        // eslint-disable-next-line flowtype/no-weak-types
    trigger(key: string, value?: any): MainModel
    }
}
