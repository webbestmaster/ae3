import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from 'root/base/base-view';
// import defaultMaps from 'root/../maps/default/map-list.json';
import ajax from 'root/util/ajax';
import httpConst from 'root/../main/http-const.json';

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

        const {refs} = this;

        const name = refs.name.value;
        const password = refs.name.value;
        const fileName = refs.map.value;

        ajax
            .post(httpConst.route.createRoom, {
                name,
                password,
                map: mapReqContext(fileName)
            })
            .then(e => console.log(e));

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

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(CreateRoom);
