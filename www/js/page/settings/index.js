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
import Form from './../../components/ui/form';
import Fieldset from './../../components/ui/fieldset';
import FormHeader from './../../components/ui/form-header';
import ButtonListWrapper from './../../components/ui/button-list-wrapper';
import serviceStyle from './../../../css/service.scss';

class Settings extends Component<void, void> {
    renderLanguageList(): Node {
        const view = this;
        const {props} = view;

        const headerString = localeConst.localeNameList
            .map((localeName: LocaleNameType): string => allLocales[localeName].LANGUAGE)
            .join(' / ');

        return (
            <Fieldset>
                <FormHeader>
                    {headerString}
                    {':'}
                </FormHeader>

                <ButtonListWrapper>
                    {localeConst.localeNameList
                        .map((localeName: LocaleNameType): Node => {
                            return (
                                <Button
                                    key={localeName}
                                    onClick={() => {
                                        props.setLocale(localeName);
                                    }}
                                >
                                    {localeConst.langName[localeName]}
                                </Button>
                            );
                        })}
                </ButtonListWrapper>
            </Fieldset>
        );
    }

    render(): Node {
        const view = this;

        return (
            <Page>
                <Header>
                    <Locale stringKey={('SETTINGS': LangKeyType)}/>
                </Header>
                <Form className={serviceStyle.grow_1}>
                    {view.renderLanguageList()}
                </Form>
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
