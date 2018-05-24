// @flow
import type {TeamIdType} from './map-guide';
import type {UnitTypeAllType, UnitTypeCommanderType} from './../components/game/model/unit/unit-guide';

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
    type: UnitTypeAllType,
    action?: UnitActionStateType,
    hitPoints?: number,
    poisonCountdown?: number,
    hasWispAura?: boolean,
    damage?: {|
        given?: number,
        received?: number
    |},
    userId?: UserIdType,
    id?: string
    // level?: number
|};

export type GraveType = {|
    x: number,
    y: number,
    removeCountdown: number
|};

export type MapUserType = {|
    userId: string,
    money: number,
    teamId: TeamIdType,
    commander?: {|
        type: UnitTypeCommanderType,
        buyCount: number
    |},
    isLeaved?: boolean
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
    type: 'skirmish',
    userList: Array<MapUserType>,
    activeUserId: string,
    unitLimit: number,
    defaultMoney: number,
    landscape: Array<Array<LandscapeType>>,
    buildings: Array<BuildingType>,
    units: Array<UnitType>,
    graves: Array<GraveType>
|};

