/**
 * Created by dmitry.turovtsov on 20.04.2017.
 */

import viewConst from './const.json';

export function setTypeTo(type, to) {
    return {
        type: viewConst.type.setTypeTo,
        payload: {
            type,
            to
        }
    };
}
