// @flow

import type {UnitActionsMapType, UnitActionType} from './unit';

export function fillActionMap(src: UnitActionsMapType, target: UnitActionsMapType) {
    src.forEach((lineAction: Array<Array<UnitActionType>>, yCell: number) => {
        lineAction.forEach((cellAction: Array<UnitActionType>, xCell: number) => {
            if (cellAction[0]) {
                // eslint-disable-next-line no-param-reassign
                target[yCell][xCell][0] = cellAction[0];
            }
        });
    });
}
