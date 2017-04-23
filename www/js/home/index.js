import React from 'react';
// import PropTypes from 'prop-types';
import BaseView from './../base/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';

class HomeView extends BaseView {

    render() {

        return <div>
            <h1>home view</h1>
        </div>;

    }

}

HomeView.propTypes = {
    // currentLanguage: PropTypes.object.isRequired,
    // changeLanguageAction: PropTypes.func.isRequired
};

export default connect(
    state => ({
        // currentLanguage: state.currentLanguage
    }),
    {

    }
)(HomeView);
