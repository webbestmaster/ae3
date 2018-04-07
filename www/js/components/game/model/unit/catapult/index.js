// @flow
import Unit from './../index';
import type {GameDataType, UnitActionsMapType} from './../index';

export default class UnitCustom extends Unit {
    getActions(gameData: GameDataType): UnitActionsMapType | null { // eslint-disable-line complexity, max-statements
        const unit = this; // eslint-disable-line consistent-this

        if (unit.getDidMove()) {
            return null;
        }

        return super.getActions(gameData);
    }
}
