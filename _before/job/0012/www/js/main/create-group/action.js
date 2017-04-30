/**
 * Created by dmitry.turovtsov on 12.04.2017.
 */

import viewConst from './const.json';
import userModel from './../../model/user';

export function setIncludingUserInNewGroup(phoneNumber, needInclude) {
    return {
        type: viewConst.type.setIncludingUserInNewGroup,
        payload: {
            phoneNumber,
            needInclude
        }
    };
}

export function toggleIncludingUserInNewGroup(phoneNumber) {
    return {
        type: viewConst.type.toggleIncludingUserInNewGroup,
        payload: {
            phoneNumber
        }
    };
}

export function resetIncludedUserInNewGroup() {
    return {
        type: viewConst.type.resetIncludedUserInNewGroup
    };
}

export function createNewGroup(groupData) {
    return dispatch => {
        dispatch({
            type: viewConst.type.createNewGroup,
            payload: {
                isInProgress: true
            }
        });

        return new Promise((resolve, reject) => {
            const userPhone = userModel.getPhoneNumber();
            const {phones} = groupData;

            if (phones.indexOf(userPhone) === -1) {
                phones.push(userPhone);
            }

            gapi.client.messaging.createGroup({
                session: userModel.getSessionId(),
                name: groupData.name,
                phones,
                type: groupData.type
            }).execute(result => {
                dispatch({
                    type: viewConst.type.createNewGroup,
                    payload: {
                        isInProgress: false
                    }
                });

                return result.error ? reject(result) : resolve(result);
            });
        });
    };
}

export function setViewVisible(isVisible) {
    return {
        type: viewConst.type.setCreateGroupViewVisible,
        payload: {
            isVisible
        }
    };
}
