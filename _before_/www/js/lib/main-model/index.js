// @flow
/* global module */
/* eslint-disable consistent-this, complexity */

// $FlowFixMe
type AttrValueType = any; // eslint-disable-line flowtype/no-weak-types

type ActionType = (newValue: AttrValueType, oldValue: AttrValueType) => AttrValueType;

type AttrType = {
    [key: string]: AttrValueType
};

type ListenersItemType = [ActionType, {}];

type ListenersType = {
    [key: string]: Array<ListenersItemType>
};

type ListeningItemType = [MainModel, string, ActionType, {}]; // eslint-disable-line no-use-before-define

type ListeningType = Array<ListeningItemType>;


/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */
export default class MainModel {
    attr: AttrType;
    listeners: ListenersType;
    listening: ListeningType;

    constructor(attributes?: Attr) {
        const model = this;

        model.attr = {};
        model.listeners = {};
        model.listening = [];

        if (attributes) {
            model.setObject(attributes);
        }
    }

    /**
     * @return {void}
     */
    destroy() {
        const model = this;

        model.attr = {};
        model.offChange();
        model.stopListening();
    }

    /**
     *
     * @param {string|object} key of value
     * @param {*} [value] saved value
     * @return {MainModel} instance
     */
    set(key: string | {}, value?: AttrValueType): MainModel {
        return typeof key === 'string' ? this.setKeyValue(key, value) : this.setObject(key);
    }

    /**
     *
     * @param {string} key of value
     * @return {*} saved value
     */
    get(key: string): AttrValueType {
        return this.attr[key];
    }

    /**
     *
     * @param {string} key of value
     * @return {MainModel} instance
     */
    unset(key: string): MainModel {
        const model = this;

        Reflect.deleteProperty(model.attr, key);
        // delete model.attr[key];
        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {number} deltaValue to change current value
     * @return {MainModel} instance
     */
    changeBy(key: string, deltaValue: number): MainModel {
        const model = this;
        const oldValue = model.get(key);

        if (typeof deltaValue === 'number' && typeof oldValue === 'number') {
            model.setKeyValue(key, oldValue + deltaValue);
        }

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {function} action to execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    onChange(key: string, action: ActionType, context?: {} = this): MainModel {
        const model = this;
        const listeners = model.getListenersByKey(key);

        listeners.push([action, context]);

        return model;
    }

    /**
     *
     * @param {string} [key] of value
     * @param {function} [action] was execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    offChange(key?: string, action?: ActionType, context?: {}): MainModel {
        const model = this;

        const argsLength = arguments.length;

        // key did not passed
        if (typeof key !== 'string') {
            model.listeners = {};
            return model;
        }

        const allListeners = model.getAllListeners();

        // action did not passed
        if (argsLength === 1) {
            allListeners[key] = [];
            return model;
        }

        if (typeof action !== 'function') {
            return model;
        }

        const listenersByKey = model.getListenersByKey(key);
        // context did not passed

        if (argsLength === 2) {
            allListeners[key] = listenersByKey
                .filter((listener: ListenersItemType): boolean => listener[0] !== action);
            return model;
        }

        if (argsLength === 3) {
            allListeners[key] = listenersByKey
                .filter((listener: ListenersItemType): boolean => listener[0] !== action || listener[1] !== context);
        }

        return model;
    }

    /**
     *
     * @param {string} key - of value
     * @param {function} test - for new value of key
     * @param {function} onValid - run if key right
     * @param {function} onInvalid - run if key wrong
     * @param {*} [context] of actions
     * @returns {MainModel} instance
     */
    setValidation(key: string,
                  test: (...args: [AttrValueType, AttrValueType]) => boolean,
                  onValid: (...args: [AttrValueType, AttrValueType]) => void,
                  onInvalid: (...args: [AttrValueType, AttrValueType]) => void,
                  context?: {} = this): MainModel {
        const model = this;

        model.onChange(key, (newValue: AttrValueType, oldValue: AttrValueType): void => {
            const args = [newValue, oldValue];

            return Reflect.apply(test, context, args) ?
                Reflect.apply(onValid, context, args) :
                Reflect.apply(onInvalid, context, args);

            /*
                        return test.apply(context, args) ?
                            onValid.apply(context, args) :
                            onInvalid.apply(context, args);
            */
        }, context);

        return model;
    }

    /**
     *
     * @param {MainModel} mainModel - other model to start listen
     * @param {string} key of value
     * @param {function} action was execute
     * @param {*} [context] of action
     * @returns {MainModel} instance
     */
    listenTo(mainModel: MainModel, key: string, action: ActionType, context?: {} = this): MainModel {
        const model = this;
        const listening = model.getListening();

        listening.push([mainModel, key, action, context]);
        mainModel.onChange(key, action, context);

        return model;
    }

    /**
     * @param {MainModel} [mainModel] - other model to stop listen
     * @param {string} [key] of value
     * @param {function} [action] was execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    stopListening(mainModel?: MainModel, key?: string, action?: ActionType, context?: {}): MainModel {
        const model = this;
        const argsLength = arguments.length;
        const listening = model.getListening();

        if (argsLength === 0) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel =>
                    model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 1) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
                    listMainModel === mainModel && model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 2) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
                    listMainModel === mainModel && listKey === key &&
                    model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 3) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]: ListeningItemType): MainModel | boolean =>
                    listMainModel === mainModel &&
                    listKey === key &&
                    listAction === action &&
                    model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        model.listening = listening.filter(
            ([listMainModel, listKey, listAction, listContext]: ListeningItemType): boolean => {
                if (mainModel &&
                    listMainModel === mainModel &&
                    listKey === key &&
                    listAction === action &&
                    listContext === context) {
                    mainModel.offChange(listKey, listAction, listContext);
                    return false;
                }
                return true;
            }
        );

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {*} [newValue] of instance
     * @param {*} [oldValue] of instance
     * @return {MainModel} instance
     */
    trigger(key: string, newValue: AttrValueType, oldValue: AttrValueType): MainModel {
        const model = this;
        const listeners = model.getListenersByKey(key);
        const argsLength = arguments.length;

        let oldValueArg = null;
        let newValueArg = null;

        if (argsLength === 1) {
            oldValueArg = model.get(key);
            newValueArg = oldValueArg;
        }

        if (argsLength === 2) {
            oldValueArg = model.get(key);
            newValueArg = newValue;
        }

        if (argsLength === 3) {
            oldValueArg = oldValue;
            newValueArg = newValue;
        }

        listeners.forEach((listenerData: ListenersItemType) => {
            Reflect.apply(listenerData[0], listenerData[1], [newValueArg, oldValueArg]);
        });
        // listeners.forEach(listenerData => listenerData[0].call(listenerData[1], newValueArg, oldValueArg));

        return model;
    }

    /**
     *
     * @return {object} all attributes
     */
    getAllAttributes(): AttrType {
        return this.attr;
    }

    /**
     *
     * @return {object} all listeners
     */
    getAllListeners(): ListenersType {
        return this.listeners;
    }

    /**
     *
     * @return {*[]} all listening
     */
    getListening(): ListeningType {
        return this.listening;
    }

    /**
     *
     * @param {string} key of value
     * @return {*[]} of listeners filtered by key
     */
    getListenersByKey(key: string): Array<[ActionType, {}]> {
        const model = this;
        const listeners = model.listeners;

        if (listeners.hasOwnProperty(key)) {
            return listeners[key];
        }

        listeners[key] = [];

        return listeners[key];
    }

    // helpers

    setObject(obj: {}): MainModel {
        const model = this;

        Object.keys(obj).forEach((key: string): MainModel => model.setKeyValue(key, obj[key]));

        return model;
    }

    setKeyValue(key: string, newValue: AttrValueType): MainModel {
        const model = this;
        const attr = model.attr;
        const oldValue = attr[key];

        if (oldValue !== newValue) {
            attr[key] = newValue;
            model.trigger(key, newValue, oldValue);
        }

        return model;
    }
}
