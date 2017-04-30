/**
 * Created by dmitry.turovtsov on 18.04.2017.
 */

import viewConst from './const.json';

export function getUserData(session) {
    return dispatch => {
        dispatch({
            type: viewConst.type.getUserData,
            payload: {
                isInProgress: true
            }
        });

        return new Promise(resolve =>
            gapi.client.authorization.getMe({
                session
            }).execute(result => {
                console.log(session);
                dispatch({
                    type: viewConst.type.getUserData,
                    payload: {
                        isInProgress: false,
                        name: result.user.userName,
                        phone: result.user.phone
                    }
                });

                resolve(result);
            })
        );
    };
}
