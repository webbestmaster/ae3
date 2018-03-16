// @flow

/*
import app from './components/app/reducer';
import clubsCatalog from './components/clubs-catalog/reducer';
import subscriptionsCatalog from './components/subscriptions-catalog/reducer';
import trainingsCatalog from './components/trainings-catalog/reducer';
import auth from './components/auth/reducer';
*/

import system from './components/system/reducer';

export {
    system

/*
    app,
    clubsCatalog,
    subscriptionsCatalog,
    trainingsCatalog,
    auth
*/
};

export type GlobalStateType = {|
    system: {|
        screen: {|
            width: number,
            height: number
        |}
    |}
|};
