// @flow

/* global window */

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import {user} from './../../module/user';
import {socket} from './../../module/socket';
import type {GlobalStateType} from './../../app-reducer';
import {store} from '../../index';
import type {SystemType} from '../system/reducer';
import Game from './model/index';
import type {SocketMessageType} from '../../module/socket';
import * as serverApi from '../../module/server-api';
import MainModel from '../../lib/main-model';
import type {AllRoomSettingsType, ServerUserType} from '../../module/server-api';


type PropsType = {|
    system: SystemType,
    roomId: string
|};

type StateType = {|
    settings?: AllRoomSettingsType,
    userList: Array<ServerUserType>,
    model: MainModel,
    game: Game
|};

type RefsType = {|
    canvas: HTMLElement
|};

class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    constructor() {
        super();

        const view = this;

        view.state = {
            userList: [],
            model: new MainModel(),
            game: new Game()
        };
    }

    async componentDidMount(): Promise<string> {
        const view = this;
        const {props, state, refs} = view;

        const {roomId} = props;

        const settings = await serverApi.getAllRoomSettings(roomId);
        const users = await serverApi.getAllRoomUsers(roomId);

        view.setState({
            settings: settings.settings,
            userList: users.users
        });

        state.game.initialize({
            view: refs.canvas,
            width: props.system.screen.width,
            height: props.system.screen.height
        });

        view.bindEventListeners();

        return roomId;
    }

    componentDidUpdate() {
        const view = this;
        const {props, state} = view;

        // check for game is initialized
        if (state.game.app) {
            state.game.setCanvasSize(props.system.screen.width, props.system.screen.height);
        }
    }

    bindEventListeners() {
        const view = this;
        const {props, state} = view;
        const {model} = state;

        model.listenTo(socket.attr.model, 'message', async (message: SocketMessageType): Promise<void> => {
            await view.onMessage(message);
        });
    }

    async onMessage(message: SocketMessageType): Promise<void> { // eslint-disable-line complexity
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {roomId} = props;
        let users = null;

        switch (message.type) {
            case 'room__take-turn':
                console.log('room__take-turn', message);
                break;

            case 'room__join-into-room':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__leave-from-room':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__user-disconnected':
                users = await serverApi.getAllRoomUsers(roomId);
                view.setState({
                    userList: users.users
                });

                break;

            case 'room__push-state':

                console.log('push - state');

                /*
                                if (message.states.last.state.isGameStart === true && state.isGameStart !== true) {
                                    console.warn('The game has begun!!!');

                                    const settings = await serverApi.getAllRoomSettings(roomId);

                                    console.log(settings);

                                    view.setState({
                                        settings: settings.settings
                                    });

                                    view.setState({isGameStart: true});

                                    return;
                                }
                */

                console.log(message);

                break;

            default:
                console.log('unsupported message type: ' + message.type);
        }
    }

    async componentWillUnmount(): Promise<void> {
        const view = this;
        const {props, state} = view;
        const {model} = state;
        const {roomId} = props;

        model.destroy();

        // todo: add Game.destroy()

        const leaveRoomResult = await serverApi.leaveRoom(roomId, user.getId());

        console.log(leaveRoomResult);
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>game</h1>

            <br/>
            <br/>

            <button onClick={async (): Promise<void> => {
                await serverApi.dropTurn(props.roomId, user.getId());
            }}>
                end turn
            </button>

            <canvas style={{
                width: props.system.screen.width,
                height: props.system.screen.height,
                display: 'block'
            }} ref="canvas"/>

        </div>;
    }
}

export default connect(
    (state: GlobalStateType): {} => ({
        system: state.system
    }),
    {
        // setUser
    }
)(GameView);
