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

Object
    .keys(api)
    .forEach(methodName =>
        Object
            .keys(apiRoute.route)
            .forEach(apiType => {
                api[methodName][apiType] = {};
                Object.keys(apiRoute.route[apiType]).forEach(pathName =>
                    Object.assign(api[methodName][apiType],
                        {
                            [pathName]: (urlKeys, data) =>
                                ajax.send(generateUrl(urlKeys, apiRoute.route[apiType][pathName]), methodName, data)
                        }
                    )
                );
            })
    );

export default api;
