// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Page from '../../components/ui/page/c-page';
import Header from '../../components/ui/header/c-header';
import Button from '../../components/ui/button/c-button';
import Locale from '../../components/locale/c-locale';
import type {LangKeyType} from '../../components/locale/translation/type';
import {allLocales, localeConst} from '../../components/locale/const';
import type {LocaleNameType} from '../../components/locale/action';
import * as localeAction from '../../components/locale/action';
import Form from '../../components/ui/form/c-form';
import Fieldset from '../../components/ui/fieldset/c-fieldset';
import FormHeader from '../../components/ui/form-header/c-form-header';
import ButtonListWrapper from '../../components/ui/button-list-wrapper/c-button-list-wrapper';
import serviceStyle from '../../../css/service.scss';

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
                    {localeConst.localeNameList.map(
                        (localeName: LocaleNameType): Node => {
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
                        }
                    )}
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
                <Form className={serviceStyle.grow_1}>{view.renderLanguageList()}</Form>
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
