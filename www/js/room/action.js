/* global setTimeout */
import user from './../model/user';
import viewConst from './const.json';

export const setRoomWatching = (() => {
    let currentWatchingState = false;

    return isEnable => {
        return dispatch => {
            if (isEnable === currentWatchingState) {
                return;
            }

            currentWatchingState = isEnable;

            if (!isEnable) {
                return;
            }

            (function watch() {
                if (!currentWatchingState) {
                    return;
                }

                dispatch({
                    type: viewConst.type.getRoomState,
                    payload: {
                        isInProgress: true
                    }
                });

                user.getRoomState()
                    .then(roomState => {
                        dispatch({
                            type: viewConst.type.getRoomState,
                            payload: {
                                isInProgress: false,
                                usersData: roomState.usersData,
                                chatMessages: roomState.chatMessages,
                                unitLimit: roomState.unitLimit,
                                defaultMoney: roomState.defaultMoney
                            }
                        });
                    })
                    .then(() => setTimeout(watch, 1e3));
            })();
        };
    };
})();
