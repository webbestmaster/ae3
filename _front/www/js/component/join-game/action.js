import viewConst from './const';

import api from './../../api';

const {SHOW_AVAILABLE_ROOMS} = viewConst;

export function showAvailableRooms() {

    return dispatch => {

        dispatch({
            type: SHOW_AVAILABLE_ROOMS,
            isLoadingRooms: true,
            roomIds: []
        });

        api.getAvailableRooms()
            .then(roomIds => dispatch({
                type: SHOW_AVAILABLE_ROOMS,
                isLoadingRooms: false,
                roomIds
            }));

    };

}
