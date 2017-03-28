import * as locales from './../i18n/index';

// set default language
let language = locales.en;

export default {

    setLang(localeName) {
        language = locales[localeName];
    },

    get(alias) {
        return language[alias];
    }

};
