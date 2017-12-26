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
const gameSetup = require('./../game/model/game-setup.json');
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
    createRoom(fileName) {
        const view = this;
        const {refs} = view;

        const gameName = refs.gameName.value;
        const gameType = refs.gameType.value;
        const password = refs.password.value;
        const {map} = _.find(mapList, {fileName});

        api.post.room
            .create(null, {
                ...map,
                gameName,
                password,
                gameType,
                chat: []
            })
            .then(instanceId => {
                view.props.setRoomId(instanceId);
                return api.get.room.join();
            })
            .then(() => view.props.router.push(routerConst.link.room));
    }

    getPlayersNumber(mapData) {
        return 2;
    }

    render() {
        const view = this;

        return <div className="view">
            <h1 className="view-header">
                <div onClick={() => history.back()} className="view-header-back"/>
                __setup__room__
            </h1>

            <div className="hidden">
                <input ref="gameName" type="text" placeholder="game name"/>
                <input ref="password" type="text" placeholder="password"/>
                <select ref="gameType">
                    {Object
                        .keys(gameSetup.gameType)
                        .map(gameType => <option value={gameType} key={gameType}>{gameType}</option>)
                    }
                </select>
            </div>

            {mapList.map(mapData =>
                <div key={mapData.fileName}>
                    <div>
                        <h3>players: {view.getPlayersNumber(mapData)}</h3>
                        <h3>{mapData.mapName}</h3>
                        <button onClick={() => view.createRoom(mapData.fileName)}>__create__game__</button>
                    </div>
                    <hr/>
                </div>
            )}

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
            instanceId: PropTypes.string.isRequired
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