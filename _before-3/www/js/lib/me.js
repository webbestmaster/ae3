import {find} from 'lodash';
import {store} from './../index';

export function isItMe(user) {
    // user && check for user needed for map wil one player
    return user && getMyPublicId() === user.publicId;
}

export function isItNotMe(user) {
    // user && check for user needed for map wil one player
    return !isItMe(user);
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
