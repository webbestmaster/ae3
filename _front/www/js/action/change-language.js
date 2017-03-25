import appConst from './../const';

const CHANGE_LANGUAGE = appConst.LANGUAGE.CHANGE_LANGUAGE;

import i18n from '../service/i18n';

export default function changeLanguage(localeName) {

    i18n.setLang(localeName);

    return {
        type: CHANGE_LANGUAGE,
        localeName
    };

}
