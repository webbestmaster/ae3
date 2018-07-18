// @flow

export type LangDataType = {|
    /* eslint-disable id-match */
    +ONLINE_GAME: string,
    +OFFLINE_GAME: string,
    +SETTINGS: string,
    +LANGUAGE: string,
    +CREATE_GAME: string,
    +JOIN_GAME: string,
    +MAP: string,
    +MAPS: string,
    +PLAYER: string,
    +PLAYERS: string,
    +MESSAGE__NO_OPEN_GAME: string,
    +LOADING: string,
    +REFRESH: string,
    +ADD_HUMAN: string,
    +ADD_BOT: string,
    +START: string,
    +WAIT_FOR_START: string,
    +SPACE: ' '
    /* eslint-enable id-match */
|};

export type LangKeyType = $Keys<LangDataType>; // eslint-disable-line id-match
