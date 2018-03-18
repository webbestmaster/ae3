// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import {connect} from 'react-redux';
import type {MapType} from './../../maps/type';

const mapReqContext = require.context('./../../maps/default/maps/', true, /\.json$/);
const mapList:Array<MapType> = mapReqContext.keys()
    .map(mapReqContext);

// import {Link} from 'react-router-dom';

// import uiStyle from './../../components/ui/ui.scss';
// import serviceStyle from './../../../css/service.scss';
// import routes from '../../app/routes';

class CreateRoom extends Component<void, void> {
    render(): Node {
        return <div>
            <h1>CreateRoom</h1>
            <br/>
            <br/>
            <h1>select map</h1>
            <br/>

            {mapList.map((map: MapType): Node => <div key={map.meta.en.name}>
                <h3>{map.meta.en.name}</h3>
            </div>)}

            <br/>
            <br/>
            <br/>
            <br/>

            <div className="json">{JSON.stringify(mapList)}</div>
            <br/>
        </div>;
    }
}

export default connect(
    (state: {}): {} => ({
        // app: state.app
    }),
    {}
)(CreateRoom);
