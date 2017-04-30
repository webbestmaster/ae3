/**
 * Created by dim on 30.4.17.
 */

import BaseModel from './../base/base-model';
import sha1 from 'sha1';
import util from './../util/util';

class User extends BaseModel {

    setId(email) {
        return this.set('id', sha1(email));
    }

    getId() {
        return this.get('id');
    }

}

export {User};

const user = new User();

console.log(util.globalify('user', user));

export default user;
