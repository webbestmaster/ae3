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
     * @param {String|Object} key
     * @param {*} [value]
     * @return {BaseModel}
     */
    set(key, value) {
        return typeof key === 'string' ? this._setKeyValue(key, value) : this._setObject(key);
    }

    /**
     *
     * @param {String} key
     * @return {*}
     */
    get(key) {
        return this._attr[key];
    }

    /**
     *
     * @param {String} key
     * @param {Number} deltaValue
     * @return {BaseModel}
     */
    changeBy(key, deltaValue) {
        return this._setKeyValue(key, this.get(key) + deltaValue);
    }

    /**
     *
     * @param {String|String[]} key
     * @param {Function} action
     * @param {*} [context]
     * @return {BaseModel}
     */
    onChange(key, action, context) {

        let model = this;

        if (Array.isArray(key)) {

            key.forEach(function (key) {
                model.onChange(key, action, context);
            });

            return model;

        }

        let listeners = model.getListenersByKey(key);

        listeners.push([action, context || null]);

        return model;

    }

    /**
     *
     * @param {String|String[]} [key]
     * @param {Function} [action]
     * @param {*} [context]
     * @return {BaseModel}
     */
    offChange(key, action, context) {

        let model = this;

        if (Array.isArray(key)) {

            key.forEach(function (key) {
                model.offChange(key, action, context);
            });

            return model;

        }

        // key did not passed
        if (key === undefined) {
            model._listeners = {};
            return model;
        }

        let listenersByKey = model.getListenersByKey(key);
        let allListeners = model.getAllListeners();

        // action did not passed
        if (action === undefined) {
            allListeners[key] = [];
            return model;
        }

        // context did not passed
        if (context === undefined) {
            allListeners[key] = listenersByKey.filter(function (listener) {
                return listener[0] !== action;
            });
            return model;
        }

        allListeners[key] = listenersByKey.filter(function (listener) {
            return !(listener[0] === action && listener[1] === context);
        });

        return model;

    }

    /**
     *
     * @param {String} key
     * @param {*} [newValue]
     * @param {*} [oldValue]
     * @return {BaseModel}
     */
    trigger(key, newValue, oldValue) {

        let model = this;

        let lesteners = model.getListenersByKey(key);

        if (oldValue === undefined) {
            oldValue = model.get(key);
        }

        if (newValue === undefined) {
            newValue = oldValue;
        }

        lesteners.forEach(function (listenerData) {
            listenerData[0].call(listenerData[1], newValue, oldValue);
        });

        return model;

    }

    /**
     *
     * @return {*}
     */
    getAllAttributes() {
        return this._attr;
    }

    /**
     *
     * @return {*}
     */
    getAllListeners() {
        return this._listeners;
    }

    /**
     *
     * @param {String} key
     * @return {Array}
     */
    getListenersByKey(key) {

        let model = this;

        if (!model._listeners[key]) {
            return model._listeners[key] = [];
        }

        return this._listeners[key];

    }

    /////////
    // helpers
    /////////

    _setObject(obj) {

        const model = this;

        Object.keys(obj).forEach(function (key) {
            model.set(key, obj[key]);
        });

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
