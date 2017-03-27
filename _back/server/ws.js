
//////
// Starting
//////

const httpModule = require('./http');
const backConst = require('./../const');
const WebSocketServer = require('ws').Server;

const webSocketServer = new WebSocketServer({server: httpModule.httpServer, port: backConst.WS_PORT});

const wsApi = require('./ws-api');

// TODO: add onDisconnect, onClose and etc.
webSocketServer.on('connection', ws => {
    ws.on('message', onMessage);
});

//////
// Event listeners
//////

function onMessage(inputStr) {

    const inputJson = JSON.parse(inputStr);

    const ws = this;

    const {className, methodName} = inputJson;
    inputJson[className] = inputJson[methodName] = null;

    const neededClass = wsApi[className] || null;

    if (neededClass === null) {
        ws.send('no needed class ' + className);
        console.warn('no needed class', className);
        return;
    }

    const neededMethod = neededClass[methodName] || null;

    if (neededMethod === null) {
        ws.send('no needed method of ' + className + '.' + neededMethod);
        console.warn('no needed method of', className, '.', neededMethod);
        return;
    }

    if (typeof neededMethod !== 'function') {
        ws.send('no function a method of ' + className + '.' + neededMethod);
        console.warn('no function a method of', className, '.', neededMethod);
        return;
    }

    neededMethod(inputJson, ws);

}


//////
// Exports
//////

module.exports = {};
