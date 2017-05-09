/* eslint-disable no-underscore-dangle */
/**
 * Created by dim on 8.5.17.
 */
class Info {

    constructor() {
        const info = this;

        info._currentKey = '';
        info._keys = [];
        info._errorMessage = '';
        info._errorState = {
            type: null,
            value: null
        };
    }

    setErrorMessage(text) {
        const info = this;

        if (info._errorMessage) {
            return false;
        }

        info._errorMessage = text;
        return true;
    }

    setCurrentKey(key) {
        this._currentKey = key;
    }

    getCurrentKey() {
        return this._currentKey;
    }

    pushKey(key) {
        this._keys.push(key);
    }

    popKey() {
        this._keys.pop();
    }

    setCurrentState(type, value) {
        const info = this;

        if (info._errorMessage) {
            return false;
        }

        if (typeof type === 'function') {
            type = type.toString(); // eslint-disable-line no-param-reassign
        }

        Object.assign(info._errorState, {type, value});
        return true;
    }

    getState() {
        const info = this;

        if (info._errorMessage) {
            return {
                isValid: false,
                isInvalid: true,
                message: info._errorMessage,
                path: info._keys.join('/'),
                state: info._errorState
            };
        }

        return {
            isValid: true,
            isInvalid: false
        };
    }

}

module.exports = Info;
