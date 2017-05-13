import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
// const routerConst = require('./../router/const.json');
import ajax from './../lib/ajax';
import _ from 'lodash';
const apiRouteConst = require('./../api-route.json');
const appConst = require('./../app-const.json');
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

        const name = refs.name.value;
        const password = refs.password.value;
        const map = _.find(mapList, {fileName: refs.map.value});

        const userId = view.props.userState.idState.id;

        ajax
            .post(appConst.serverUrl + apiRouteConst.route.creteRoom, {
                name,
                password,
                map
            })
            .then(roomId =>
                ajax.get(appConst.serverUrl +
                    apiRouteConst.route.joinRoom
                        .replace(':roomId', roomId)
                        .replace(':privateUserId', userId
                        )
                )
            );
    }

    render() {
        const view = this;

        return <div>
            <h1>setup room</h1>
            <input ref="name" type="text" placeholder="game name"/>
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
    router: PropTypes.object.isRequired
};

export default connect(
    state => ({
        userState: state.userState
    }),
    {}
)(SetupRoomView);
