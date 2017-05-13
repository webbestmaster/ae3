import * as locales from './languages/';

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
