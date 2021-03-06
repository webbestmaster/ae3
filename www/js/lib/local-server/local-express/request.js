// @flow

/* eslint consistent-this: ["error", "localExpressRequest"] */
import type {PushedStateType} from '../room/room';

type ParamsType = {+[key: string]: string};
type ConstructorOptionsType = {|
    +params: ParamsType,
    +body: PushedStateType,
|};

export class LocalExpressRequest {
    params: ParamsType;
    body: PushedStateType; // | SettingsType;

    constructor(constructorOptions: ConstructorOptionsType) {
        const localExpressRequest = this;

        localExpressRequest.params = constructorOptions.params;
        localExpressRequest.body = constructorOptions.body;
    }
}
