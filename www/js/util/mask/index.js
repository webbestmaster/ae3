const mask = require('./mask.js');

module.exports.createMask = schema => donor => mask(schema, donor, {});
