/**
 * Created by dmitry.turovtsov on 27.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BaseView from './../../core/base-view';

class SearchView extends BaseView {

    render() {
        return <div className="search">
            <input className="search__input" type="text" placeholder="Search..."/>
            <div className="search__bg"/>
        </div>;
    }

}

SearchView.propTypes = {

};

export default connect(
    state => ({}),
    {}
)(SearchView);
