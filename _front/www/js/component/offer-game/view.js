import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import appConst from './../../const';

class OfferGame extends BaseView {

    constructor() {
        super();
        const view = this;
    }


    render() {

        return <div>

            <h1>__offer_game__</h1>

        </div>

    }

}

OfferGame.propTypes = {};

export default connect(
    state => ({}),
    {}
)(OfferGame);
