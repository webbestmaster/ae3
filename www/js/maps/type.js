// @flow

export type PlayerIdType = 'player-0' | 'player-1' | 'player-2' | 'player-3';

export type LandscapeType =
    'bridge-0' |
    'bridge-1' |
    'forest-0' |
    'forest-1' |
    'hill-0' |
    'road-0' |
    'stone-0' |
    'stone-1' |
    'terra-0' |
    'terra-1' |
    'terra-2' |
    'terra-3' |
    'terra-4' |
    'water-0' |
    'water-1' |
    'water-2';

export type BuildingType = {|
    x: number,
    y: number,
    type: 'castle' | 'farm' | 'farm-destroyed' | 'well' | 'temple',
    playerId?: PlayerIdType
|};

export type UnitType = {|
    x: number,
    y: number,
    type: 'soldier' |
        'archer' |
        'elemental' |
        'sorceress' |
        'wisp' |
        'dire-wolf' |
        'golem' |
        'catapult' |
        'dragon' |
        'skeleton' |
        // company unit
        'crystal' |
        // commanders
        'galamar' |
        'valadorn' |
        'demon-lord' |
        'saeth',
    hitPoint?: number,
    level?: number,
    playerId?: PlayerIdType
|};

export type GraveType = {|
    x: number,
    y: number,
    countdown: number
|};

export type MapType = {|
    meta: {
        en: {
            local: string,
            name: string
        },
        ru: {
            local: string,
            name: string
        }
    },
    landscape: Array<Array<LandscapeType>>,
    buildings: Array<BuildingType>,
    units: Array<UnitType>,
    graves: Array<GraveType>
|};