// @flow
/* global window, IS_PRODUCTION */

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
