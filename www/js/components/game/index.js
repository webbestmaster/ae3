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


type PropsType = {|
    system: SystemType
|};

type StateType = {|
    game: Game
|};

type RefsType = {|
    canvas: HTMLElement
|};

class GameView extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;
    refs: RefsType;

    async componentDidMount(): Promise<void> {
        const view = this;
        const {props, state, refs} = view;
        const game = new Game();

        game.initialize({
            view: refs.canvas,
            width: props.system.screen.width,
            height: props.system.screen.height
        });

        view.setState({game});
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        return <div>
            <h1>game</h1>
            <canvas style={{display: 'block'}} ref="canvas"/>
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
