import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import appConst from './../../const';
import viewConst from './const';
import {setGameCreatingProperty} from './action';

class CreateGame extends BaseView {

    constructor() {
        super();
        const view = this;
    }

    changeSetting(key, value) {

        const view = this;

        view.props.setGameCreatingProperty(key, value);

    }

    render() {

        const view = this;

        const {NAME, PASSWORD, MAP_NAME, TYPE} = viewConst.GAME_PROPERTY;

        return <div>

            <h1>__create_game__</h1>

            <hr/>
            <input onInput={e => view.changeSetting(NAME, e.currentTarget.value)} type="text"
                   placeholder="__game_name__"/>

            <hr/>
            <input onInput={e => view.changeSetting(PASSWORD, e.currentTarget.value)} type="text"
                   placeholder="__game_password__"/>

            <hr/>
            here is should be select with maps
            <input onInput={e => view.changeSetting(MAP_NAME, e.currentTarget.value)} type="text"
                   placeholder="__map_name__"/>

            <hr/>
            here is should be select game type
            <input onInput={e => view.changeSetting(TYPE, e.currentTarget.value)} type="text"
                   placeholder="__game_type__"/>

            <hr/>
            <Link to={appConst.link.offerGame}> __create_game__ </Link>

        </div>

    }

}

CreateGame.propTypes = {};

export default connect(
    state => ({
        gameCreating: state.gameCreating
    }),
    {
        setGameCreatingProperty
    }
)(CreateGame);
