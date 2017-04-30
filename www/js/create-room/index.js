import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';
// import defaultMaps from 'root/../maps/default/map-list.json';
import ajax from './../util/ajax';
import httpConst from './../../main/http-const.json';
import viewPropTypes from './prop-types';
import routerConst from './../router/const.json';
import user from './../model/user';

const mapReqContext = require.context('./../../maps/default/maps/', true, /\.json$/);

const mapList = mapReqContext.keys()
    .map(fileName => {
        const map = mapReqContext(fileName);

        return {
            mapName: map.localization.en.name,
            map,
            fileName
        };
    });

class CreateRoom extends BaseView {

    createRoom() {
        const view = this;
        const {refs} = view;

        const name = refs.name.value;
        const password = refs.password.value;
        const fileName = refs.map.value;

        ajax
            .post(httpConst.route.createRoom, {
                name,
                password,
                map: mapReqContext(fileName)
            })
            .then(response => {
                const responseObj = JSON.parse(response);

                user.set(user.const.roomId, responseObj.roomId);
            })
            .then(() => view.props.router.push(routerConst.route.room));
    }

    render() {
        const view = this;

        return <div>
            <h1>create room</h1>

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

        </div>;
    }

}

CreateRoom.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(CreateRoom);
