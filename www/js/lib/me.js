import {find} from 'lodash';
import {store} from './../index';

export function isItMe(user) {
    return getMyPublicId() === user.publicId;
}

export function findMe(users) {
    return find(users, {publicId: store.getState().userState.publicIdState.publicId});
}

export function getMyOrder(users) {
    return users.indexOf(findMe(users));
}

export function getMyPublicId() {
    return store.getState().userState.publicIdState.publicId;
}
