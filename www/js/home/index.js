import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as userAction from './../user/action';
const routerConst = require('./../router/const.json');

class HomeView extends BaseView {
    componentDidMount() {
        this.props.setUserId(Math.random());
    }

    render() {
        return <div>
            <h1>home view</h1>
            <hr/>
            <hr/>
            <Link to={routerConst.link.createRoom}>crete room</Link>
            <hr/>
        </div>;
    }
}

HomeView.propTypes = {
    router: PropTypes.object.isRequired,

    setUserId: PropTypes.func.isRequired
};

export default connect(
    state => ({}),
    {
        setUserId: userAction.setId
    }
)(HomeView);
