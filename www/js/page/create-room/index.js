// @flow

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {MapType} from './../../maps/type';
import mapGuide from './../../maps/map-guide';
import * as serverApi from './../../module/server-api';
import type {GlobalStateType} from './../../app-reducer';
import type {AuthType} from './../../components/auth/reducer';
import routes, {type HistoryType} from './../../app/routes';

// const mapReqContext = require.context('./../../maps/default/maps/', true, /\.json$/);
// const mapList: Array<MapType> = mapReqContext.keys()
//     .map(mapReqContext);

const {myFirstMap} = require('./../../maps/default/maps/my-first-map-for-flow-test');
const mapList: Array<MapType> = [myFirstMap];

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
            console.error('can not create a room');
            return null;
        }

        const {mapIndex, defaultMoney, unitLimit} = state;
        const map: MapType = JSON.parse(JSON.stringify(mapList[mapIndex]));
        const socketId = props.auth.socket.id;
        const userId = props.auth.user.id;

        map.unitLimit = unitLimit;
        map.defaultMoney = defaultMoney;
        map.userList = [];

        /*
        map.userList = [{
            userId,
            teamId: mapGuide.teamIdList[0],
            money: defaultMoney
        }];
*/
        map.activeUserId = userId;

        const setAllRoomSettingsResult = await serverApi.setAllRoomSettings(createRoomResult.roomId, {
            map
            // userList: [{
            //     userId,
            //     socketId,
            //     teamId: mapGuide.teamIdList[0]
            // }]
        });

        const joinRoomResult = await serverApi.joinRoom(createRoomResult.roomId, userId, socketId);

        if (joinRoomResult.roomId === '') {
            return null;
        }

        props.history.push(routes.room.replace(':roomId', joinRoomResult.roomId));

        return joinRoomResult.roomId;
    }

    render(): Node {
        const view = this;
        const {state} = view;

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
                {defaultMoney} {defaultMoney === state.defaultMoney ? '<-' : ''}
            </div>)}

            <br/>

            <h1>unitLimit</h1>
            {mapGuide.unitLimitList.map((unitLimit: number): Node => <div
                onClick={(): void => view.setState({unitLimit})}
                key={unitLimit}>
                {unitLimit} {unitLimit === state.unitLimit ? '<-' : ''}
            </div>)}

            <br/>
            <br/>
            <br/>
            <br/>

            <button
                onClick={async (): Promise<void> => {
                    const result = await view.createRoom();
                }}
            >
                create room
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
