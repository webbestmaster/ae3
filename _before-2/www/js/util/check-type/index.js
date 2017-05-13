/**
 * Created by dim on 8.5.17.
 */
const Info = require('./info');
const checkType = require('./chec-type');
const props = require('./props');

function check(schema, obj) {
    const info = new Info();

    checkType(schema, obj, info);

    return info.getState();
}

module.exports.createChecker = schema => obj => check(schema, obj);

module.exports.props = props;
