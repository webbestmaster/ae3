/* global gapi */
import gapiConst from './const.json';
import appConst from './../../app-const.json';
const {api} = appConst;

const {clientApiNames} = gapiConst;

export function initGapiClient() {
    return dispatch => {
        dispatch({
            type: gapiConst.type.initializeClient,
            payload: {
                client: null
            }
        });

        return initializeGapiClient().then(() => dispatch({
            type: gapiConst.type.initializeClient,
            payload: {
                client: gapi.client
            }
        }));
    };
}

/**
 *
 * @returns {Promise} - will resolve when google's client created
 */
function initializeGapiClient() {
    const modulePromises = {
        addScript: null,
        addClient: null
    };

    /**
     *
     * @returns {Promise} - will resolve when google's api script will be loaded
     */
    function addGoogleScript() {
        if (!modulePromises.addScript) {
            modulePromises.addScript = new Promise(resolve => {
                window.gapiInit = () => {
                    Reflect.deleteProperty(window, 'gapiInit');
                    resolve();
                };

                const script = document.createElement('script');

                script.src = gapiConst.url.script + '?onload=gapiInit';
                document.head.appendChild(script);
            });
        }

        return modulePromises.addScript;
    }

    /**
     *
     * @returns {Promise} - will resolve when google's client added into gapi
     */
    function addGoogleClient() {
        if (!modulePromises.addClient) {
            modulePromises.addClient = new Promise(resolve => gapi.load('client', resolve));
        }

        return modulePromises.addClient;
    }

    /**
     *
     * @param {string} apiName - name of class/method
     * @returns {Promise} - will resolve when google's client add new class/method
     */
    function loadClientApi(apiName) {
        return new Promise(resolve => gapi.client.load(apiName, api.version, resolve, api.root));
    }

    return addGoogleScript()
        .then(addGoogleClient)
        .then(() => Promise.all(clientApiNames.map(loadClientApi)))
        .catch(err => console.error(err));
}
