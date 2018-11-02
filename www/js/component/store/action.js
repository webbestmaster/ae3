// @flow

import {storeConst} from './const';

export type SetOpenFromGameType = {|
    +type: 'store__open-from-game',
    +payload: {|
        +isOpenFromGame: boolean,
    |},
|};

export function setOpenFromGame(isOpenFromGame: boolean): SetOpenFromGameType {
    return {
        type: storeConst.action.type.setOpenFromGame,
        payload: {
            isOpenFromGame,
        },
    };
}
