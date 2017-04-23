import React from 'react';
// import PropTypes from 'prop-types';
import BaseView from 'root/base/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';

import Login from 'root/login';

class Home extends BaseView {

    render() {

        return <div>
            <h1>home view</h1>
            <hr/>
            <Login />
        </div>;

    }

}


Home.propTypes = {
    // currentLanguage: PropTypes.object.isRequired,
    // changeLanguageAction: PropTypes.func.isRequired
};

export default connect(
    state => ({
        // currentLanguage: state.currentLanguage
    }),
    {}
)(Home);
