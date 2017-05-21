const viewConst = require('./const.json');

export function setState(payload) {
    return {
        type: viewConst.type.setState,
        payload
    };
}

export function resetState() {
    console.warn('THIS IS NOT delete all props');
    // TODO: fix this!
    return {
        type: viewConst.type.setState,
        payload: {
            users: []
        }
    };
}
