/**
 * Created by dim on 2.5.17.
 */

const sha1 = require('sha1');

const publicIdPrefix = 'public-user-id-';
const publicIdPostfix = '-public-user-id';

module.exports = function gpubui(privUserId) {
    return [publicIdPrefix, sha1(privUserId), publicIdPostfix].join('');
};
