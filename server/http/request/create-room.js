const createError = require('./../util.js').createError;
const streamBodyParser = require('./../util.js').streamBodyParser;
const Room = require('./../../model/room.js').model;

const {createChecker, props} = require('./../util.js').checkType;
const {mask} = require('./../util.js').mask;

const mapSchema = {
    props: {
        localization: {
            type: props.arr,
            isRequired: true,
            props: {
                type: props.obj,
                props: {
                    local: {
                        type: props.str,
                        isRequired: true
                    },
                    name: {
                        type: props.str,
                        isRequired: true
                    }
                }
            }
        },
        layer: {
            isRequired: true,
            props: {
                landscape: {
                    isRequired: true,
                    type: props.arr,
                    props: {
                        type: props.str
                    }
                },
                building: {
                    isRequired: true,
                    type: props.arr,
                    props: {
                        type: props.obj,
                        props: {
                            x: {
                                type: props.nbr,
                                isRequired: true
                            },
                            y: {
                                type: props.nbr,
                                isRequired: true
                            },
                            type: {
                                type: props.str,
                                isRequired: true
                            },
                            playerId: {
                                type: props.str,
                                isRequired: true
                            }
                        }
                    }
                },
                unit: {
                    type: props.arr,
                    isRequired: true,
                    props: {
                        type: props.obj,
                        props: {
                            x: {
                                type: props.nbr,
                                isRequired: true
                            },
                            y: {
                                type: props.nbr,
                                isRequired: true
                            },
                            type: {
                                type: props.str,
                                isRequired: true
                            },
                            playerId: {
                                type: props.str,
                                isRequired: true
                            }
                        }
                    }
                }
            }
        }
    }
};

const createRoomSchema = {
    props: {
        map: mapSchema,
        name: {
            type: props.str,
            isRequired: true
        },
        password: {
            type: props.str,
            isRequired: true
        }

    }
};

const createRoomSchemaChecker = createChecker(createRoomSchema);

module.exports.createRoom = (req, res) => {
    streamBodyParser(req,
        body => {
            const parsedBody = JSON.parse(body);
            const dryRequest = mask(createRoomSchema, parsedBody);

            if (!createRoomSchemaChecker(dryRequest).isValid) {
                createError({}, res, 'Invalid parameters to create room');
                return;
            }

            const room = new Room(parsedBody);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                roomId: room.get('id')
            }));
        },
        evt => createError(evt, res, 'Can not create room')
    );
};
