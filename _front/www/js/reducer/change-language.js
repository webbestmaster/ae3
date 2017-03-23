import appConst from './../const';

const initialState = {
    localeName: 'en'
};

const CHANGE_LANGUAGE = appConst.LANGUAGE.CHANGE_LANGUAGE;

export default function currentLanguage(state = initialState, action) {

    if (action.type === CHANGE_LANGUAGE) {
        return {
            ...state,
            localeName: action.localeName
        };
    }

    return state;

}
