// @flow

import type {SetLocaleType} from '../component/locale/action';
import type {OnResizeType} from '../component/system/action';
import type {SetUserType, SetSocketType} from '../component/auth/action';
import type {SetOpenFromGameType} from '../component/store/action';

type DefaultActionDataType = {|type: string|};

export type ActionDataType =
    | DefaultActionDataType
    | SetLocaleType
    | OnResizeType
    | SetUserType
    | SetSocketType
    | SetOpenFromGameType;
