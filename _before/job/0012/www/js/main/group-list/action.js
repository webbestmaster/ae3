/**
 * Created by dmitry.turovtsov on 13.04.2017.
 */

import viewConst from './const.json';
import userModel from './../../model/user';

// import appConst from 'root/app-const.json';

import _ from 'lodash';

export function updateGroups() {
    return dispatch => {
        dispatch({
            type: viewConst.type.updateGroups,
            payload: {
                isInProgress: true
            }
        });

        return new Promise((resolve, reject) => {
            gapi.client.messaging.getGroups({
                session: userModel.getSessionId()
            }).execute(result => {
                if (result.error) {
                    dispatch({
                        type: viewConst.type.updateGroups,
                        payload: {
                            isInProgress: false
                        }
                    });

                    return reject(result);
                }

                const items = (result.items || []).map(item => _.pick(item, ['name', 'type', 'id', 'admins']));

                dispatch({
                    type: viewConst.type.updateGroups,
                    payload: {
                        isInProgress: false,
                        items
                    }
                });

                return resolve(result);
            });
        });
    };
}
