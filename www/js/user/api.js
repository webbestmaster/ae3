import {store} from './../index';
import ajax from './../lib/ajax';
const apiRoute = require('./../api-route.json');

function generateUrl(urlKeys, rawUrl) {
    const {userState} = store.getState();
    let url = rawUrl
        .replace(':privateUserId', userState.idState.id)
        .replace(':roomId', userState.roomIdState.roomId);

    if (urlKeys && typeof urlKeys === 'object') {
        Object.keys(urlKeys).forEach(key => {
            url = url.replace(':' + key, urlKeys[key]);
        });
    }

    return url;
}

const api = {
    get: {},
    post: {}
};

Object.keys(api).forEach(methodName =>
    Object.keys(apiRoute.route)
        .forEach(path =>
            Object.assign(
                api[methodName],
                {[path]: (urlKeys, data) => ajax.send(generateUrl(urlKeys, apiRoute.route[path]), methodName, data)}
            )
        )
);

export default api;
