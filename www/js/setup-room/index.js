import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
// const routerConst = require('./../router/const.json');
// import ajax from './../lib/ajax';
import _ from 'lodash';
import * as userAction from './../user/action';
import api from './../user/api';
// const apiRouteConst = require('./../api-route.json');
const routerConst = require('./../router/const.json');

const mapReqContext = require.context('./../../maps/default/maps/', true, /\.json$/);
const mapList = mapReqContext.keys()
    .map(fileName => {
        const map = mapReqContext(fileName);

        return {
            mapName: map.localization[0].name,
            map,
            fileName
        };
    });

class SetupRoomView extends BaseView {
    createRoom() {
        const view = this;
        const {refs} = view;

        const gameName = refs.gameName.value;
        const password = refs.password.value;
        const {map} = _.find(mapList, {fileName: refs.map.value});

        api.post
            .creteRoom(null, {
                ...map,
                gameName,
                password,
                chat: []
            })
            .then(roomId => {
                view.props.setRoomId(roomId);
                return api.get.joinRoom();
            })
            .then(() => {
                view.props.router.push(routerConst.link.room);
            });
    }

    render() {
        const view = this;

        return <div>
            <h1>setup room</h1>
            <input ref="gameName" type="text" placeholder="game name"/>
            <br/>
            <input ref="password" type="text" placeholder="password"/>
            <br/>
            <select ref="map">
                {mapList.map(mapData =>
                    <option value={mapData.fileName} key={mapData.fileName}>
                        {mapData.mapName}
                    </option>)}
            </select>
            <hr/>

            <button onClick={() => view.createRoom()}>create room</button>
            <hr/>
        </div>;
    }
}

SetupRoomView.propTypes = {
    router: PropTypes.object.isRequired,

    userState: PropTypes.shape({
        idState: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired,
        roomIdState: PropTypes.shape({
            roomId: PropTypes.string.isRequired
        }).isRequired,
        publicIdState: PropTypes.shape({
            publicId: PropTypes.string.isRequired
        }).isRequired
    }),

    setRoomId: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userState: state.userState
    }),
    {
        setRoomId: userAction.setRoomId
    }
)(SetupRoomView);
