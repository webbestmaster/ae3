/**
 * Created by dim on 2.5.17.
 */

import sha1 from 'sha1';

const privateIdPrefix = 'private-user-id-';
const privateIdPostfix = '-private-user-id';

export default function (userId) {
    return [privateIdPrefix, sha1(userId), privateIdPostfix].join('');
}
