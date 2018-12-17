// @flow
import type {LangKeyType} from '../../locale/translation/type';
import type {UserColorType} from '../../../maps/map-guide';

export function getWaitForLangKey(color: UserColorType): LangKeyType {
    switch (color) {
        case 'red':
            return 'WAIT_FOR_RED';
        case 'blue':
            return 'WAIT_FOR_BLUE';
        case 'green':
            return 'WAIT_FOR_GREEN';
        case 'black':
            return 'WAIT_FOR_BLACK';
        default:
            console.error('can not find lang key for', color);
            return 'SPACE';
    }
}
