// @flow

export type LangDataType = {|
    /* eslint-disable id-match */
    +ONLINE_GAME: string,
    +OFFLINE_GAME: string,
    +SETTINGS: string,
    +LANGUAGE: string,
    CREATE_GAME: string,
    JOIN_GAME: string,
    +SPACE: ' '
    /* eslint-enable id-match */
|};

export type LangKeyType = $Keys<LangDataType>; // eslint-disable-line id-match
