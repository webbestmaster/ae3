// @flow

import type {SystemType} from '../component/system/reducer/root';
import type {AuthType} from '../component/auth/reducer';
import type {LocaleType} from '../component/locale/reducer';
import type {StoreType} from '../component/store/reducer';

export {system} from '../component/system/reducer/root';

export {auth} from '../component/auth/reducer';

export {locale} from '../component/locale/reducer';

export {store} from '../component/store/reducer';

export type GlobalStateType = {|
    +auth: AuthType,
    +system: SystemType,
    +locale: LocaleType,
    +store: StoreType,
|};
