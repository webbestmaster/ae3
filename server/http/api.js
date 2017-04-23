const serverConst = require('./../server-const');
const {httpPort} = serverConst;

const Room = require('./../model/room').model;

const serverInfoResponse = JSON.stringify({
    httpPort
});

module.exports.getInfo = function (req, res) {
    res.end(serverInfoResponse);
};

function streamBodyParser(request, success, error) {

    let body = '';

    request.on('data', data => body += data);

    request.on('end', () => success(body));

    request.on('error', error);

    request.on('close', e => console.warn('WARNING: request closed', e));

}

module.exports.createRoom = function (req, res) {

    streamBodyParser(req,
        body => {

            const parsedBody = JSON.parse(body);

            const room = new Room(parsedBody);

            res.end(JSON.stringify({
                roomId: room.get('id')
            }));

        },
        e => {
            console.error('Can not create room');
            console.error(e);
            Object.assign(res, {statusCode: 500});
            res.end('Can not create room');
        }
    );

};


/*
 const backConst = require('./../const');
 const roomModule = require('./../other/room');
 const Room = roomModule.Room;
 const getRoomIds = roomModule.getRoomIds;
 const {httpPort, WS_PORT} = backConst;
 const roomValidator = require('./../validator/room');


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


 function getAvailableRooms(req, res) {
 res.end(JSON.stringify(getRoomIds()));
 }

 module.exports.createRoom = createRoom;
 module.exports.getInfo = getInfo;
 module.exports.getAvailableRooms = getAvailableRooms;
 */
