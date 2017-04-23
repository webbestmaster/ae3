/*
const backConst = require('./../const');
const roomModule = require('./../other/room');
const Room = roomModule.Room;
const getRoomIds = roomModule.getRoomIds;
const {HTTP_PORT, WS_PORT} = backConst;
const roomValidator = require('./../validator/room');

function streamBodyParser(request, success, error) {

    // TODO: add on error and on close

    let body = '';

    // Stream events
 // Event: 'close'
 // Event: 'data'
 // Event: 'end'
 // Event: 'error'
 // Event: 'readable'

 // https://nodejs.org/api/stream.html

 request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        success(body);
    });

 file.on('error', function (err) {
 res.statusCode = 404;
 res.end();
 });

 // client close connection
 // close - this is error for res
 // finish - is normal for res
 res.on('close', function () {
 file.destroy();
 });


 }

function createRoom(req, res) {

    streamBodyParser(req, body => {

        const parsedBody = JSON.parse(body);

        if (roomValidator.create.isInvalid(parsedBody)) {
            res.statusCode = 500;
            res.end('Invalid game parameters');
            return;
        }

        const room = new Room(parsedBody);

        res.end(JSON.stringify({
            roomId: room.get('id')
        }));

    });

}

const serverInfoResponse = JSON.stringify({
    HTTP_PORT
    // WS_PORT
});

function getInfo(req, res) {
    res.end(serverInfoResponse);
}

function getAvailableRooms(req, res) {
    res.end(JSON.stringify(getRoomIds()));
}

module.exports.createRoom = createRoom;
module.exports.getInfo = getInfo;
module.exports.getAvailableRooms = getAvailableRooms;
*/
