import React from 'react';
import PropTypes from 'prop-types';
import BaseView from '../base/base-view';
import {connect} from 'react-redux';
// import {Link} from 'react-router';
import appConst from './../../const';
const viewConst = require('./const.json');
import api from './../../api';
import {userModel} from './../../api/user-model';
import {setGameCreatingProperty} from './action';
const defaultMapList = require('./../../../_main/map/default-map-list.json');

class CreateRoom extends BaseView {

    createRoom() {

        const view = this;

        const gameSetting = view.props.gameCreating.setting;

        api.createRoom(gameSetting)
            .then(data => userModel.connectToRoom(data.roomId))
            .then(message => this.props.router.push(appConst.link.openRoom));

    }

    render() {

        const view = this;
        const props = view.props;

        const setProperty = props.setGameCreatingProperty;
        const {setting} = props.gameCreating;

        const {NAME, PASSWORD, MAP, TYPE} = viewConst.GAME_PROPERTY;

        return <div>

            <h1>__setup_room__</h1>

            <hr/>

            <input
                defaultValue={setting[NAME]}
                onInput={e => setProperty(NAME, e.currentTarget.value)}
                type="text"
                placeholder="__game_name__"/>

            <hr/>

            <input defaultValue={setting[PASSWORD]}
                   onInput={e => setProperty(PASSWORD, e.currentTarget.value)}
                   type="text"
                   placeholder="__game_password__"/>

            <hr/>

            Map list:

            {defaultMapList.list.map(fileName => {
                const mapData = require('./../../../_main/map/default-maps/' + fileName + '.' + defaultMapList['file-extend']);
                return <div key={fileName}>
                    <input
                        defaultChecked={JSON.parse(view.props.gameCreating.setting[MAP]).localization.en.name === mapData.localization.en.name}
                        type="radio"
                        onClick={() => setProperty(MAP, JSON.stringify(mapData))}
                        name="default-map-list"/>
                    {mapData.localization.en.name}
                </div>;}
            )}

            <hr/>

            here is should be select game type

            <input defaultValue={setting[TYPE]}
                   onInput={e => setProperty(TYPE, e.currentTarget.value)}
                   type="text"
                   placeholder="__game_type__"/>

            <hr/>

            <button onClick={() => view.createRoom()}> __create_room__</button>

        </div>;

    }

}

CreateRoom.propTypes = {
    gameCreating: PropTypes.object.isRequired,
    setGameCreatingProperty: PropTypes.func.isRequired
};

export default connect(
    state => ({
        gameCreating: state.gameCreating
    }),
    {
        setGameCreatingProperty
    }
)(CreateRoom);
