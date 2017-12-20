/* global module */
/* eslint-disable no-underscore-dangle */

/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */
class MainModel {
    constructor(attributes) {
        const model = this;

        model._listeners = {};
        model._attr = {};
        model._listening = [];

        if (attributes) {
            model.set(attributes);
        }
    }

    /**
     * @return {void}
     */
    destroy() {
        const model = this;

        model._attr = {};
        model.offChange();
        model.stopListening();
    }

    /**
     *
     * @param {string|object} key of value
     * @param {*} [value] saved value
     * @return {MainModel} instance
     */
    set(key, value) {
        return typeof key === 'string' ? this._setKeyValue(key, value) : this._setObject(key);
    }

    /**
     *
     * @param {string} key of value
     * @return {*} saved value
     */
    get(key) {
        return this._attr[key];
    }

    /**
     *
     * @param {String} key of value
     * @return {MainModel} instance
     */
    unset(key) {
        const model = this;

        Reflect.deleteProperty(model._attr, key);
        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {number} deltaValue to change current value
     * @return {MainModel} instance
     */
    changeBy(key, deltaValue) {
        const model = this;

        return model._setKeyValue(key, model.get(key) + deltaValue);
    }

    /**
     *
     * @param {string} key of value
     * @param {function} action to execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    onChange(key, action, context = this) {
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
    offChange(key, action, context) {
        const model = this;

        const argsLength = arguments.length;

        // key did not passed
        if (argsLength === 0) {
            model._listeners = {};
            return model;
        }

        const allListeners = model.getAllListeners();

        // action did not passed
        if (argsLength === 1) {
            allListeners[key] = [];
            return model;
        }

        const listenersByKey = model.getListenersByKey(key);

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
     * @param {string} key - of value
     * @param {function} test - for new value of key
     * @param {function} onValid - run if key right
     * @param {function} onInvalid - run if key wrong
     * @param {*} [context] of actions
     * @returns {MainModel} instance
     */
    setValidation(key, test, onValid, onInvalid, context = this) {
        const model = this;

        model.onChange(key, (newValue, oldValue) => {
            const args = [newValue, oldValue];

            return Reflect.apply(test, context, args) ?
                Reflect.apply(onValid, context, args) :
                Reflect.apply(onInvalid, context, args);
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
    listenTo(mainModel, key, action, context = this) {
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
    stopListening(mainModel, key, action, context) {
        const model = this;
        const argsLength = arguments.length;
        const listening = model.getListening();

        if (argsLength === 0) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]) =>
                    model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 1) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]) =>
                listMainModel === mainModel && model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 2) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]) =>
                listMainModel === mainModel && listKey === key &&
                model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        if (argsLength === 3) {
            listening.forEach(
                ([listMainModel, listKey, listAction, listContext]) =>
                listMainModel === mainModel &&
                listKey === key &&
                listAction === action &&
                model.stopListening(listMainModel, listKey, listAction, listContext)
            );
            return model;
        }

        model._listening = listening.filter(
            ([listMainModel, listKey, listAction, listContext]) => {
                if (listMainModel === mainModel &&
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
            oldValueArg = model.get(key);
            newValueArg = newValue;
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
     * @return {object} all attributes
     */
    getAllAttributes() {
        return this._attr;
    }

    /**
     *
     * @return {object} all listeners
     */
    getAllListeners() {
        return this._listeners;
    }

    /**
     *
     * @return {*[]} all listening
     */
    getListening() {
        return this._listening;
    }

    /**
     *
     * @param {string} key of value
     * @return {*[]} of listeners filtered by key
     */
    getListenersByKey(key) {
        const model = this;
        const listeners = model._listeners;
        const listenersByKey = listeners[key];

        if (listenersByKey) {
            return listenersByKey;
        }

        listeners[key] = [];

        return listeners[key];
    }

    // helpers

    _setObject(obj) {
        const model = this;

        Object.keys(obj).forEach(key => model._setKeyValue(key, obj[key]));

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

module.exports = MainModel;
