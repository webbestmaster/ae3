// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Page from '../../component/ui/page/c-page';
import Header from '../../component/ui/header/c-header';
import Button from '../../component/ui/button/c-button';
import Locale from '../../component/locale/c-locale';
import type {LangKeyType} from '../../component/locale/translation/type';
import {allLocales, localeConst} from '../../component/locale/const';
import type {LocaleNameType} from '../../component/locale/action';
import * as localeAction from '../../component/locale/action';
import Form from '../../component/ui/form/c-form';
import Fieldset from '../../component/ui/fieldset/c-fieldset';
import FormHeader from '../../component/ui/form-header/c-form-header';
import ButtonListWrapper from '../../component/ui/button-list-wrapper/c-button-list-wrapper';
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