// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Page from './../../components/ui/page';
import Header from './../../components/ui/header';
import Locale from './../../components/locale';
import type {LangKeyType} from './../../components/locale/translation/type';

class Settings extends Component<void, void> { // eslint-disable-line react/prefer-stateless-function
    render(): Node {
        return (
            <Page>
                <Header>
                    <Locale stringKey={('HOME_PAGE__SETTINGS': LangKeyType)}/>
                </Header>
            </Page>
        );
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(Settings);
