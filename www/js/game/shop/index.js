import React from 'react';
import BaseView from '../../core/base-view';
import {connect} from 'react-redux';
import {getMyOrder} from './../../lib/me';
const unitGuide = require('./../model/unit/unit-guide.json');
// import {Link} from 'react-router';

class ShopView extends BaseView {
    constructor() {
        super();
    }

    componentDidMount() {
        const view = this;

        console.log(view.props.game);
    }

    addUnit(unitType) {
        const view = this;
        const {game} = view.props;
        const shop = game.get('shop');

        // TODO: here is should be send to server
        // decrease players money
        // action: add new unit
        // exit from store to move unit

        game.addUnit({
            x: shop.get('x'),
            y: shop.get('y'),
            type: unitType,
            userOrder: getMyOrder(game.get('users'))
        });
    }

    render() {
        const view = this;

        return <div>
            <h1>SHOP</h1>

            {Object.keys(unitGuide.type).map(unitType => <div key={unitType}>
                {JSON.stringify(unitGuide.type[unitType])}
                <button onClick={() => {
                    view.addUnit(unitType);
                }}>buy unit</button>
            </div>)}

        </div>;
    }
}

ShopView.propTypes = {};

export default connect(
    state => ({}),
    {}
)(ShopView);
