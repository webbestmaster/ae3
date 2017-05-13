/* global module */
/* eslint-disable no-underscore-dangle */

class BaseModel {
    constructor(properies) {
        console.log('Created Model ->', this.constructor.name);
        console.log(this);

        const model = this;

        model._listeners = {};
        model._attr = {};

        if (properies) {
            model.set(properies);
        }
    }

    destroy() {
        const model = this;

        model._attr = {};
        model.offChange();
    }

    /**
     *
     * @param {string|object} key of value
     * @param {*} [value] saved value
     * @return {BaseModel} instance
     */
    set(key, value) {
        return typeof key === 'string' ? this._setKeyValue(key, value) : this._setObject(key);
    }

    /**
     *
     * @param {String} key of value
     * @return {*} saved value
     */
    get(key) {
        return this._attr[key];
    }

    /**
     *
     * @param {string} key of value
     * @param {number} deltaValue to change current value
     * @return {BaseModel} instance
     */
    changeBy(key, deltaValue) {
        return this._setKeyValue(key, this.get(key) + deltaValue);
    }

    /**
     *
     * @param {string|string[]} key of value
     * @param {Function} action to execute
     * @param {*} [context] of action
     * @return {BaseModel} instance
     */
    onChange(key, action, context) {
        const model = this;

        if (Array.isArray(key)) {
            key.forEach(keyFromList => model.onChange(keyFromList, action, context));

            return model;
        }

        const listeners = model.getListenersByKey(key);

        listeners.push([action, context || null]);

        return model;
    }

    /**
     *
     * @param {string|string[]} [key] of value
     * @param {Function} [action] was execute
     * @param {*} [context] of action
     * @return {BaseModel} instance
     */
    offChange(key, action, context) {
        const model = this;

        const argsLength = arguments.length;

        if (Array.isArray(key)) {
            key.forEach(keyFromList => model.offChange(keyFromList, action, context));

            return model;
        }

        // key did not passed
        if (argsLength === 0) {
            model._listeners = {};
            return model;
        }

        const listenersByKey = model.getListenersByKey(key);
        const allListeners = model.getAllListeners();

        // action did not passed
        if (argsLength === 1) {
            allListeners[key] = [];
            return model;
        }

        // context did not passed
        if (argsLength === 2) {
            allListeners[key] = listenersByKey.filter(listener => listener[0] !== action);
            return model;
        }

        allListeners[key] = listenersByKey.filter(listener => listener[0] !== action || listener[1] !== context);

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {*} [newValue] of instance
     * @param {*} [oldValue] of instance
     * @return {BaseModel} instance
     */
    trigger(key, newValue, oldValue) {
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
            oldValueArg = oldValue;
            newValueArg = oldValueArg;
        }

        if (argsLength === 3) {
            oldValueArg = oldValue;
            newValueArg = newValue;
        }

        listeners.forEach(listenerData => Reflect.apply(listenerData[0], listenerData[1], [newValueArg, oldValueArg]));

        return model;
    }

    /**
     *
     * @return {*} all attributes
     */
    getAllAttributes() {
        return this._attr;
    }

    /**
     *
     * @return {*} all listeners
     */
    getAllListeners() {
        return this._listeners;
    }

    /**
     *
     * @param {string} key of value
     * @return {Array} of listeners filtered by key
     */
    getListenersByKey(key) {
        const model = this;

        if (!model._listeners[key]) {
            model._listeners[key] = [];
            return model.getListenersByKey(key);
        }

        return this._listeners[key];
    }

    // helpers

    _setObject(obj) {
        const model = this;

        Object.keys(obj).forEach(key => model.set(key, obj[key]));

        return model;
    }

    _setKeyValue(key, newValue) {
        const model = this;
        const attr = model._attr;
        const oldValue = attr[key];

        if (oldValue !== newValue) {
            attr[key] = newValue;
            model.trigger(key, newValue, oldValue);
        }

        return model;
    }
}

module.exports = BaseModel;
