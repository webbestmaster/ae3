const viewConst = require('./const.json');

export function setState(payload) {
    return {
        type: viewConst.type.setState,
        payload
    };
}

export function resetState() {
    return {
        type: viewConst.type.setState,
        payload: {
            users: []
        }
    };
}
