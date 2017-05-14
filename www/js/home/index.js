import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as userAction from './../user/action';
import ajax from './../lib/ajax';
const routerConst = require('./../router/const.json');
const apiRouteConst = require('./../api-route.json');

class HomeView extends BaseView {
    componentDidMount() {
        const view = this;


        const privateUserId = view.props.setUserId(Math.random()).payload.id;

        ajax
            .get(apiRouteConst.route.getPublicId.replace(':key', privateUserId))
            .then(publicId => view.props.setPublicId(publicId));
    }

    render() {
        return <div>
            <h1>home view</h1>
            <hr/>
            <hr/>
            <Link to={routerConst.link.setupRoom}>setup room</Link>
            <hr/>
            <Link to={routerConst.link.joinRoom}>join room</Link>
            <hr/>
        </div>;
    }
}

HomeView.propTypes = {
    router: PropTypes.object.isRequired,

    setUserId: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userState: state.userState
    }),
    {
        setUserId: userAction.setId,
        setPublicId: userAction.setPublicId
    }
)(HomeView);
