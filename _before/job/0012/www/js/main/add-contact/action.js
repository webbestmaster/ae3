/**
 * Created by dmitry.turovtsov on 07.04.2017.
 */

import viewConst from './const.json';
import userModel from './../../model/user';

export function addPhoneNumber(contactData) {
    return dispatch => {
        dispatch({
            type: viewConst.type.addPhoneNumber,
            payload: {
                isInProgress: true
            }
        });

        return new Promise((resolve, reject) => {
            gapi.client.relationships.updateNamedPhonebook({
                session: userModel.getSessionId(),
                phonebook: [],
                phonesAdded: [
                    {
                        contactName: contactData.contactName,
                        contactPhone: Number(contactData.contactPhone)
                    }
                ],
                phonesRemoved: []
            }).execute(result => {
                dispatch({
                    type: viewConst.type.addPhoneNumber,
                    payload: {
                        isInProgress: false
                    }
                });

                return result.error ? reject(result) : resolve(result);
            });
        });
    };
}
