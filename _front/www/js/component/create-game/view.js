import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import appConst from './../../const';

class CreateGame extends BaseView {

    constructor() {
        super();
        const view = this;
    }


    render() {

        return <div>

            <h1>__create_game__</h1>

            <hr/>
            <input type="text" placeholder="__game_name__"/>

            <hr/>
            <input type="text" placeholder="__game_password__"/>

            <hr/>
            here is should be select with maps
            <input type="text" placeholder="__map_name__"/>

            <hr/>
            here is should be select game type
            <input type="text" placeholder="__game_type__"/>

            <hr/>
            <Link to={appConst.link.offerGame}> __create_game__ </Link>

        </div>

    }

}

CreateGame.propTypes = {};

export default connect(
    state => ({}),
    {}
)(CreateGame);
