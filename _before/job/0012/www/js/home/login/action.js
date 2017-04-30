/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

/* global gapi */
import viewConst from './const.json';

export function switchLoginProgress(isInProgress) {
    return {
        type: viewConst.type.switchLoginProgress,
        payload: {
            isInProgress
        }
    };
}
