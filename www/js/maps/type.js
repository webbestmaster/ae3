// @flow

export type UserIdType = string;

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

export type BuildingAttrTypeType = 'castle' | 'farm' | 'farm-destroyed' | 'well' | 'temple';

export type BuildingType = {|
    x: number,
    y: number,
    type: BuildingAttrTypeType,
    userId?: UserIdType,
    id?: string
|};

export type UnitActionStateType = {|
    didMove?: boolean,
    didAttack?: boolean,

    didFixBuilding?: boolean,
    didOccupyBuilding?: boolean,
    didDestroyBuilding?: boolean,

    didRaiseSkeleton?: boolean
|};

const unitActionStateDefaultValue: UnitActionStateType = {
    didMove: false,
    didAttack: false,

    didFixBuilding: false,
    didOccupyBuilding: false,
    didDestroyBuilding: false,

    didRaiseSkeleton: false
};

export {unitActionStateDefaultValue};

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
    action?: UnitActionStateType,
    hitPoints?: number,
    poisonCountdown?: number,
    hasWispAura?: boolean,
    damage?: {|
        given?: number,
        received?: number
    |},
    userId?: UserIdType,
    id?: string,
    level?: number
|};

export type GraveType = {|
    x: number,
    y: number,
    removeCountdown: number
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
