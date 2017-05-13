/**
 * Created by dim on 8.5.17.
 */
const checkTypeProps = require('./props');
const ctpFnc = checkTypeProps.fnc;
const ctpObj = checkTypeProps.obj;
const ctpStr = checkTypeProps.str;
const ctpNbr = checkTypeProps.nbr;
const ctpBln = checkTypeProps.bln;
const ctpArr = checkTypeProps.arr;

function createMainEveryFn(value, props, info) {
    return key => {
        info.setCurrentKey(key);
        if (value.hasOwnProperty(key)) {
            return checkType(props[key], value[key], info);
        }

        if (props[key].isRequired) {
            info.pushKey(info.getCurrentKey());
            info.setCurrentState(props[key].type, value[key]);
            info.setErrorMessage('Key is required');
            return false;
        }

        return true;
    };
}

function createArrayEveryFn(schemaItem, info) {
    return (item, index) => {
        info.setCurrentKey(index);
        return checkType(schemaItem, item, info);
    };
}

function checkFnc(type, value, info) {
    if (type(value)) {
        info.popKey();
        return true;
    }
    info.setErrorMessage('Do NOT match by function');
    return false;
}

function checkRe(type, value, info) {
    if (type.test(value)) {
        info.popKey();
        return true;
    }
    info.setErrorMessage('Do NOT match by regExp');
    return false;
}

function checkMain(type, value, props, info) {
    if (typeof value !== type) {
        info.setErrorMessage('Has different type');
        return false;
    }

    const isPropsValid = Object.keys(props)
        .every(createMainEveryFn(value, props, info));

    if (isPropsValid) {
        info.popKey();
        return true;
    }

    return false;
}

function checkArr(type, value, info) {
    if (!Array.isArray(value)) {
        info.setErrorMessage('Should be an array');
        return false;
    }

    const isArrayItemsValid = value.every(createArrayEveryFn(type, info));

    if (isArrayItemsValid) {
        info.popKey();
        return true;
    }

    return false;
}

function checkType(schema, value, info) {
    const {type = ctpObj, props = {}} = schema;

    info.pushKey(info.getCurrentKey());
    info.setCurrentState(type, value);

    if (typeof type === ctpFnc) {
        return checkFnc(type, value, info);
    }

    if (type instanceof RegExp) {
        return checkRe(type, value, info);
    }

    if (type === ctpArr) {
        return checkArr(schema.props, value, info);
    }

    if ([ctpFnc, ctpObj, ctpStr, ctpNbr, ctpBln].indexOf(type) !== -1) {
        return checkMain(type, value, props, info);
    }

    throw new Error('Can not resolve type: ' + type);
}

module.exports = checkType;
