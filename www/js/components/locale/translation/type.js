// @flow

export type LangDataType = {|
    /* eslint-disable id-match */
    +HOME_PAGE__ONLINE_GAME: string,
    +HOME_PAGE__OFFLINE_GAME: string,
    +HOME_PAGE__SETTINGS: string,
    +SPACE: ' '
    /* eslint-enable id-match */
|};

export type LangKeyType = $Keys<LangDataType>; // eslint-disable-line id-match
