import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as userAction from './../user/action';
import api from './../user/api';
import {RaisedButton} from 'material-ui';
const routerConst = require('./../router/const.json');

class HomeView extends BaseView {
    componentDidMount() {
        const view = this;

        view.props.setUserId(Math.random());
        api.get.other.getPublicId().then(publicId => view.props.setPublicId(publicId));
    }

    render() {
        return <div className="view view--home">
            <div className="wh50">
                <h1 className="home-title">AE:Live</h1>
            </div>
            <div className="wh50 ta-center">
                <Link className="view-button" to={routerConst.link.setupRoom}>__create__game__</Link>
                <Link className="view-button" to={routerConst.link.joinRoom}>__join__game__</Link>
            </div>
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
            instanceId: PropTypes.string.isRequired
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
