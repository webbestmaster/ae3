// @flow

/* global window, BUILD_DATE, BRANCH_NAME, IS_PRODUCTION, PROJECT_ID, BUILD_DATE_H */

export type AppConstType = {|
    +api: {|
        +url: string,
    |},
|};

const {hostname, origin} = window.location;

export const appConst: AppConstType = {
    api: {
        // eslint-disable-next-line id-match
        // url: IS_PRODUCTION ? origin : 'http://' + hostname + ':3001'
        // eslint-disable-next-line id-match
        url: IS_PRODUCTION ? origin : 'http://aefree.herokuapp.com',
    },
};

window.appData = {
    // eslint-disable-next-line id-match
    BUILD_DATE,
    // eslint-disable-next-line id-match
    BUILD_DATE_H,
    // eslint-disable-next-line id-match
    BRANCH_NAME,
    // eslint-disable-next-line id-match
    IS_PRODUCTION,
    // eslint-disable-next-line id-match
    PROJECT_ID,
};
