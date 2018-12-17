// @flow

export type LangDataType = {|
    /* eslint-disable id-match */
    +ONLINE_GAME: string,
    +OFFLINE_GAME: string,
    +COMPANIES: string,
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
    +YOU: string,
    +HUMAN: string,
    +ADD_HUMAN: string,
    +BOT: string,
    +ADD_BOT: string,
    +START: string,
    +WAIT_FOR_START: string,
    +CASTLE: string,

    // units name
    +UNIT__SOLDIER__NAME: string,
    +UNIT__ARCHER__NAME: string,
    +UNIT__ELEMENTAL__NAME: string,
    +UNIT__SORCERESS__NAME: string,
    +UNIT__WISP__NAME: string,
    +UNIT__DIRE_WOLF__NAME: string,
    +UNIT__GOLEM__NAME: string,
    +UNIT__CATAPULT__NAME: string,
    +UNIT__DRAGON__NAME: string,
    +UNIT__SKELETON__NAME: string,
    +UNIT__GALAMAR__NAME: string,
    +UNIT__VALADORN__NAME: string,
    +UNIT__DEMON_LORD__NAME: string,
    +UNIT__SAETH__NAME: string,
    +UNIT__CRYSTAL__NAME: string,
    +UNIT__SAETH_HEAVENS_FURY__NAME: string,

    // units description
    +UNIT__SOLDIER__DESCRIPTION: string,
    +UNIT__ARCHER__DESCRIPTION: string,
    +UNIT__ELEMENTAL__DESCRIPTION: string,
    +UNIT__SORCERESS__DESCRIPTION: string,
    +UNIT__WISP__DESCRIPTION: string,
    +UNIT__DIRE_WOLF__DESCRIPTION: string,
    +UNIT__GOLEM__DESCRIPTION: string,
    +UNIT__CATAPULT__DESCRIPTION: string,
    +UNIT__DRAGON__DESCRIPTION: string,
    +UNIT__SKELETON__DESCRIPTION: string,
    +UNIT__GALAMAR__DESCRIPTION: string,
    +UNIT__VALADORN__DESCRIPTION: string,
    +UNIT__DEMON_LORD__DESCRIPTION: string,
    +UNIT__SAETH__DESCRIPTION: string,
    +UNIT__CRYSTAL__DESCRIPTION: string,
    // eslint-disable-next-line id-length
    +UNIT__SAETH_HEAVENS_FURY__DESCRIPTION: string,

    // init app
    +ENVIRONMENT_SETTING: string,
    +SETTING_UP_CONNECTIONS: string,
    +LOADING_TEXTURES: string,
    +PREPARATION_OF_IMAGES: string,

    // popup
    +DIALOG_CONFIRM_APPLY: string,
    +DIALOG_CONFIRM_CANCEL: string,

    // spec symbols
    +SPACE: ' ',
    /* eslint-enable id-match */
|};

// eslint-disable-next-line id-match
export type LangKeyType = $Keys<LangDataType>;
