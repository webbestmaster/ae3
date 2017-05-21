import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class GameView extends BaseView {
    render() {
        return <div>
            <h1>Game view</h1>
        </div>;
    }
}

GameView.propTypes = {
};

export default connect(
    state => ({}),
    {}
)(GameView);
