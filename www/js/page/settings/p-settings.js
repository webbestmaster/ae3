// @flow

/* eslint consistent-this: ["error", "view"] */

import type {ComponentType, Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Page} from '../../component/ui/page/c-page';
import {Header} from '../../component/ui/header/c-header';
import {Button} from '../../component/ui/button/c-button';
import {Locale} from '../../component/locale/c-locale';
import type {LangKeyType} from '../../component/locale/translation/type';
import type {LocaleNameType} from '../../component/locale/const';
import {allLocales, localeConst} from '../../component/locale/const';
import type {SetLocaleType} from '../../component/locale/action';
import {setLocale} from '../../component/locale/action';
import {Form} from '../../component/ui/form/c-form';
import {Fieldset} from '../../component/ui/fieldset/c-fieldset';
import {FormHeader} from '../../component/ui/form-header/c-form-header';
import {ButtonListWrapper} from '../../component/ui/button-list-wrapper/c-button-list-wrapper';
import serviceStyle from '../../../css/service.scss';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import type {GlobalStateType} from '../../redux-store-provider/reducer';
import type {LocaleType} from '../../component/locale/reducer';

type ReduxPropsType = {|
    +locale: LocaleType,
|};

type ReduxActionType = {|
    +setLocale: (localeName: LocaleNameType) => SetLocaleType,
|};

const reduxAction: ReduxActionType = {
    setLocale,
};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        ...$Exact<ContextRouterType>,
    }>>;

type StateType = null;

class Settings extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    makeHandlerSetLocale(localeName: LocaleNameType): () => void {
        const view = this;
        const {props} = view;

        return () => {
            props.setLocale(localeName);
        };
    }

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
                                <Button onClick={view.makeHandlerSetLocale(localeName)} key={localeName}>
                                    {props.locale.name === localeName ? '->' : '\u00A0\u00A0'}
                                    &nbsp;
                                    {localeConst.langName[localeName]}
                                    &nbsp;&nbsp;&nbsp;
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

const ConnectedComponent = connect<ComponentType<Settings>, PassedPropsType, ReduxPropsType, ReduxActionType>(
    (state: GlobalStateType): ReduxPropsType => ({
        locale: state.locale,
    }),
    reduxAction
)(Settings);

export {ConnectedComponent as Settings};
