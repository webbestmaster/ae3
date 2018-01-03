// @flow
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {createRoom, joinRoom} from './../../module/server-api';
import {user} from './../../module/user';
import {socket} from './../../module/socket';

type Props = { /* ... */ };
type State = { /* ... */ };
type Attr = { /* ... */ }

export default class CreatingGame extends Component<Props, State> {
    createRoom() {
        socket.initSocket()
            .then(createRoom)
            .then(roomData => joinRoom(roomData.roomId, user.getId(), socket.getId()))
            .then(() => console.log('room joined'));
    }

    render() {
        const view = this;

        return <div>
            <h1>__text__creating-game</h1>
            <br/>
            <br/>
            <input placeholder="__text__game-name" type="text"/>
            <br/>
            <br/>
            <select>
                <option>map name 1</option>
                <option>map name 2</option>
                <option>map name 3</option>
            </select>
            <br/>
            <br/>
            <button onClick={() => view.createRoom()}>__text__create-game</button>
        </div>;
    }
}
