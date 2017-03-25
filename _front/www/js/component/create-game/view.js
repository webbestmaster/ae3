import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';

class CreateGame extends BaseView {

    constructor() {
        super();
        const view = this;
    }


    render() {

        return <div>

            <h2>create game</h2>

            <hr/>

        </div>

    }

}

CreateGame.propTypes = {};

export default connect(
    state => ({}),
    {}
)(CreateGame);
