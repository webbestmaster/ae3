// @flow
import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';

type Props = { /* ... */ };
type State = { /* ... */ };
type Attr = { /* ... */ }

export default class CreatingGame extends Component<Props, State> {
    render() {
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
            <button>__text__create-game</button>
        </div>;
    }
}
