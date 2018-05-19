// @flow
/* global window, IS_PRODUCTION */

export type AppConstType = {|
    +api: {|
        +url: string
    |}
|};

const {hostname, origin} = window.location;

const appConst: AppConstType = {
    api: {
        // url: IS_PRODUCTION ? origin : 'http://' + hostname + ':3001' // eslint-disable-line id-match
        url: IS_PRODUCTION ? origin : 'http://aefree.herokuapp.com' // eslint-disable-line id-match
    }
};

export default appConst;
