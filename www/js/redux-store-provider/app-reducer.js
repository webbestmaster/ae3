// @flow

/*
import app from './components/app/reducer';
import clubsCatalog from './components/clubs-catalog/reducer';
import subscriptionsCatalog from './components/subscriptions-catalog/reducer';
import trainingsCatalog from './components/trainings-catalog/reducer';
import auth from './components/auth/reducer';
*/

import type {SystemType} from '../component/system/reducer/reducer';
import system from '../component/system/reducer/reducer';

import type {AuthType} from '../component/auth/reducer';
import auth from '../component/auth/reducer';

import type {LocaleType} from '../component/locale/reducer';
import locale from '../component/locale/reducer';

export {auth, system, locale};

export type GlobalStateType = {|
    +auth: AuthType,
    +system: SystemType,
    +locale: LocaleType
|};
