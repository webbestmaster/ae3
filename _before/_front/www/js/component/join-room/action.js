import viewConst from './const';

import api from './../../api';

const {UPDATE_AVAILABLE_ROOMS} = viewConst;

export function updateAvailableRooms() {

    return dispatch => {

        dispatch({
            type: UPDATE_AVAILABLE_ROOMS,
            isLoaded: false,
            roomIds: []
        });

        api.getAvailableRooms()
            .then(roomIds => dispatch({
                type: UPDATE_AVAILABLE_ROOMS,
                isLoaded: true,
                roomIds
            }));

    };

}
