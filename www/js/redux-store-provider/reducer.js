// @flow

import type {SystemType} from '../component/system/reducer/root';
import {system} from '../component/system/reducer/root';

import type {AuthType} from '../component/auth/reducer';
import {auth} from '../component/auth/reducer';

import type {LocaleType} from '../component/locale/reducer';
import {locale} from '../component/locale/reducer';

import type {StoreType} from '../component/store/reducer';
import {store} from '../component/store/reducer';

export {auth, system, locale, store};

export type GlobalStateType = {|
    +auth: AuthType,
    +system: SystemType,
    +locale: LocaleType,
    +store: StoreType,
|};
