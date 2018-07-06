// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Page from './../../components/ui/page';
import Header from './../../components/ui/header';
import Button from './../../components/ui/button';
import Locale from './../../components/locale';
import type {LangKeyType} from './../../components/locale/translation/type';
import {localeConst} from './../../components/locale/const';
import type {LocaleNameType} from '../../components/locale/action';
import * as localeAction from './../../components/locale/action';
import {allLocales} from './../../components/locale/const';

class Settings extends Component<void, void> {
    renderLanguageList(): Node {
        const view = this;
        const {props} = view;

        return (
            <div>
                {localeConst.localeNameList.map((localeName: LocaleNameType): Node => {
                    return (
                        <span key={localeName}>
                            {allLocales[localeName].LANGUAGE}
                        </span>
                    );
                })}

                {localeConst.localeNameList.map((localeName: LocaleNameType): Node => {
                    return (
                        <Button
                            key={localeName}
                            onClick={() => {
                                props.setLocale(localeName);
                            }}
                        >
                            {localeName}
                        </Button>
                    );
                })}
            </div>
        );
    }

    render(): Node {
        const view = this;

        return (
            <Page>
                <Header>
                    <Locale stringKey={('HOME_PAGE__SETTINGS': LangKeyType)}/>
                </Header>
                {view.renderLanguageList()}
            </Page>
        );
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {
        setLocale: localeAction.setLocale
    }
)(Settings);
