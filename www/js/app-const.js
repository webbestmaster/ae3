// @flow
/* global window */

export type AppConstType = {|
    +api: {|
        +url: string
    |}
|};


const appConst: AppConstType = {
    api: {
        url: 'http://' + window.location.hostname + ':3001'
    }
};

export default appConst;
