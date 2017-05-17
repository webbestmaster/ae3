import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as userAction from './../user/action';
import api from './../user/api';
const routerConst = require('./../router/const.json');

class HomeView extends BaseView {
    componentDidMount() {
        const view = this;

        view.props.setUserId(Math.random());
        api.get.other.getPublicId().then(publicId => view.props.setPublicId(publicId));
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

    userState: PropTypes.shape({
        idState: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired,
        publicIdState: PropTypes.shape({
            publicId: PropTypes.string.isRequired
        }).isRequired,
        roomIdState: PropTypes.shape({
            roomId: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,

    setUserId: PropTypes.func.isRequired,
    setPublicId: PropTypes.func.isRequired
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
