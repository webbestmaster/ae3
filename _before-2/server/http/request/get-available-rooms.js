/**
 * Created by dim on 8.5.17.
 */
const getRoomIds = require('./../../model/room.js').getRoomIds;

module.exports.getAvailableRooms = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(getRoomIds()));
};
