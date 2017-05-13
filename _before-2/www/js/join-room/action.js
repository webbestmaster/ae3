/**
 * Created by dim on 1.5.17.
 */

import viewConst from './const.json';
import ajax from './../util/ajax';
import httpConst from './../../main/http-const.json';

export function getAvailableRooms() {
    return dispatch => {
        dispatch({
            type: viewConst.type.getAvailableRooms,
            payload: {
                isInProgress: true
            }
        });

        ajax
            .get(httpConst.route.getAvailableRooms)
            .then(roomIdsStr => {
                dispatch({
                    type: viewConst.type.getAvailableRooms,
                    payload: {
                        isInProgress: false,
                        roomIds: JSON.parse(roomIdsStr)
                    }
                });
            });
    };
}
