// @flow

import type {UnitActionType, UnitActionsMapType} from '.';

export function fillActionMap(src: UnitActionsMapType, target: UnitActionsMapType) {
    src.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
        lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
            if (cellAction[0]) {
                target[yCell][xCell][0] = cellAction[0]; // eslint-disable-line no-param-reassign
            }
        });
    });
}
