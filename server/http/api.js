const serverConst = require('./../server-const');
const {httpPort} = serverConst;
const roomModule = require('./../model/room');
const Room = roomModule.model;
const getRoomIds = roomModule.getRoomIds;

const serverInfoResponse = JSON.stringify({
    httpPort
});

module.exports.getInfo = (req, res) => {
    res.end(serverInfoResponse);
};

function streamBodyParser(request, success, error) {
    let body = '';

    request.on('data', data => {
        body += data;
    });

    request.on('end', () => success(body));

    request.on('error', error);

    request.on('close', evt => console.warn('WARNING: request closed', evt));
}

module.exports.createRoom = (req, res) => {
    streamBodyParser(req,
        body => {
            const parsedBody = JSON.parse(body);

            const room = new Room(parsedBody);

            res.end(JSON.stringify({
                roomId: room.get('id')
            }));
        },
        evt => {
            console.error('Can not create room');
            console.error(evt);
            Object.assign(res, {statusCode: 500});
            res.end(JSON.stringify({error: 'Can not create room'}));
        }
    );
};

module.exports.getAvailableRooms = (req, res) => {
    res.end(JSON.stringify(getRoomIds()));
};

/*
 const backConst = require('./../const');
 const roomModule = require('./../other/room');
 const Room = roomModule.Room;
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

 module.exports.createRoom = createRoom;
 module.exports.getInfo = getInfo;
 module.exports.getAvailableRooms = getAvailableRooms;
 */
