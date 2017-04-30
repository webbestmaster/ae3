/**
 * Created by dmitry.turovtsov on 07.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';

class PublicView extends BaseView {

    render() {
        return <div>

            <hr/>

            <h1>public is here</h1>

            <button>Gem4me</button>
            <button>all</button>

        </div>;
    }

}

PublicView.propTypes = {

};

export default connect(
    state => ({
    }),
    {
    }
)(PublicView);
