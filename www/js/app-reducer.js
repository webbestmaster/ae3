// @flow

/*
import app from './components/app/reducer';
import clubsCatalog from './components/clubs-catalog/reducer';
import subscriptionsCatalog from './components/subscriptions-catalog/reducer';
import trainingsCatalog from './components/trainings-catalog/reducer';
import auth from './components/auth/reducer';
*/

import type {SystemType} from './components/system/reducer';
import system from './components/system/reducer';

import type {AuthType} from './components/auth/reducer';
import auth from './components/auth/reducer';

import type {LocaleType} from './components/locale/reducer';
import locale from './components/locale/reducer';

export {auth, system, locale};

export type GlobalStateType = {|
    +auth: AuthType,
    +system: SystemType,
    +locale: LocaleType
|};
