// @flow

export type LangTranslateType = {|
    +title_page__button__create_game: string,
    +title_page__button__multi_player: string
|};

type I18nDictionaryType = {|
    +enUs: LangTranslateType,
    +ruRu: LangTranslateType
|};

import langEnUs from './langs/en-us';
import langRuRu from './langs/ru-ru';

const i18n: I18nDictionaryType = {
    enUs: langEnUs,
    ruRu: langRuRu
};

export {i18n};
