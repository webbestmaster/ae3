// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import type {MapType} from './../../maps/type';
import mapGuide from './../../maps/map-guide';
import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from '../../app-reducer';
import type {AuthType} from '../../components/auth/reducer';
import routes, {type HistoryType} from './../../app/routes';

const mapReqContext = require.context('./../../maps/default/maps/', true, /\.json$/);
const mapList: Array<MapType> = mapReqContext.keys()
    .map(mapReqContext);

// import {Link} from 'react-router-dom';

// import uiStyle from './../../components/ui/ui.scss';
// import serviceStyle from './../../../css/service.scss';
// import routes from '../../app/routes';
type StateType = {|
    mapIndex: number,
    defaultMoney: number,
    unitLimit: number
|};

type PropsType = {|
    auth: AuthType,
    history: HistoryType
|};

class CreateRoom extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor() {
        super();

        const view = this;

        view.state = {
            mapIndex: 0,
            defaultMoney: mapGuide.defaultMoneyList[0],
            unitLimit: mapGuide.unitLimitList[0]
        };
    }

    async createRoom(): Promise<string | null> {
        const view = this;
        const {props, state} = view;

        const createRoomResult = await serverApi.createRoom();

        if (createRoomResult.roomId === null) {
            return null;
        }

        const {mapIndex, defaultMoney, unitLimit} = state;
        const map: MapType = mapList[mapIndex];
        const socketId = props.auth.socket.id;
        const userId = props.auth.user.id;

        const setAllRoomSettingsResult = await serverApi.setAllRoomSettings(createRoomResult.roomId, {
            map,
            defaultMoney,
            unitLimit
        });

        console.log('setAllRoomSettingsResult', setAllRoomSettingsResult);

        const joinRoomResult = await serverApi.joinRoom(createRoomResult.roomId, userId, socketId);

        if (joinRoomResult.roomId === '') {
            return null;
        }

        props.history.push(routes.room.replace(':roomId', joinRoomResult.roomId));

        return joinRoomResult.roomId;

        /*
        const getAllRoomSettingsResult = await serverApi.getAllRoomSettings(joinRoomResult.roomId);

        console.log('getAllRoomSettingsResult');
        console.log(getAllRoomSettingsResult.settings);
        console.log(getAllRoomSettingsResult.roomId);

        return joinRoomResult.roomId;
*/
    }

    render(): Node {
        const view = this;

        return <div>
            <h1>CreateRoom</h1>
            <br/>
            <br/>
            <h1>select map</h1>
            <br/>

            {mapList.map((map: MapType, mapIndex: number): Node => <div
                onClick={(): void => view.setState({mapIndex})}
                key={map.meta.en.name}>
                <h3>{map.meta.en.name}</h3>
            </div>)}

            <h1>defaultMoney</h1>
            {mapGuide.defaultMoneyList.map((defaultMoney: number): Node => <div
                onClick={(): void => view.setState({defaultMoney})}
                key={defaultMoney}>
                {defaultMoney}
            </div>)}

            <br/>

            <h1>unitLimit</h1>
            {mapGuide.unitLimitList.map((unitLimit: number): Node => <div
                onClick={(): void => view.setState({unitLimit})}
                key={unitLimit}>
                {unitLimit}
            </div>)}

            <br/>
            <br/>
            <br/>
            <br/>

            <button
                onClick={async (): Promise<void> => {
                    const result = view.createRoom();
                }}
            >create room
            </button>

            <br/>
            <br/>
            <br/>
            <br/>
            <div className="json">{JSON.stringify(mapList)}</div>
            <br/>
        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        auth: state.auth
    }),
    {}
)(CreateRoom);
