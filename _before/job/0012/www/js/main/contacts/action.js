/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

import viewConst from './const.json';
import userModel from './../../model/user';
import _ from 'lodash';

export function updateContactList() {
    return dispatch => {
        dispatch({
            type: viewConst.type.updateContactList,
            payload: {
                isInProgress: true
            }
        });

        let items = [];

        return getFriendsPhoneNumber()
            .then(friendsPhoneNumber => {
                const phones = friendsPhoneNumber.items || [];

                items = phones.map(phoneNumber => ({phoneNumber, userName: ''}));
                return getUsersDisplayData(phones);
            })
            .then(usersDisplayData => items.forEach(item => {
                const userData = _.find(usersDisplayData.usersDisplayData, {phone: item.phoneNumber});

                return userData && userData.userName && Object.assign(item, {userName: userData.userName});
            }))
            .catch(evt => {
                console.error('CAN not get users data');
                console.error(evt);
            })
            // always
            .then(() => dispatch({
                type: viewConst.type.updateContactList,
                payload: {
                    isInProgress: false,
                    items
                }
            }));
    };
}

export function setViewVisible(isVisible) {
    return {
        type: viewConst.type.setContactsViewVisible,
        payload: {
            isVisible
        }
    };
}

// helpers
function getFriendsPhoneNumber() {
    return new Promise((resolve, reject) => {
        gapi.client.relationships.getFriends({
            session: userModel.getSessionId()
        }).execute(result => result.error ? reject(result) : resolve(result));
    });
}

function getUsersDisplayData(phones) {
    return new Promise((resolve, reject) => {
        gapi.client.relationships.getUsersDisplayData({
            session: userModel.getSessionId(),
            phones
        }).execute(result => result.error ? reject(result) : resolve(result));
    });
}
