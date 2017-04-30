import React from 'react';
// import PropTypes from 'prop-types';
import BaseView from './../base/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Login from './../login';

import routerConst from './../router/const.json';

class Home extends BaseView {

    render() {

        return <div>
            <h1>home view</h1>
            <hr/>
            <Login />
            <hr/>
            <Link to={routerConst.route.createRoom}>crete room</Link>
            <hr/>
            <Link to={routerConst.route.joinRoom}>join room</Link>
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
