import React from 'react';
import BaseView from '../../core/base-view';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getMyOrder, findMe} from './../../lib/me';
import api from '../../user/api';
import * as shopAction from './action';
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
        const unitData = unitGuide.type[unitType];
        // TODO: here is should be send to server
        // decrease players money
        // action: add new unit
        // exit from store to move unit

        const user = findMe(game.get('users'));
        const {money} = user;

        view.props.setShopVisible(false);

        Promise
            .all([
                api.post.room.setUserState(null, {money: money - unitData.cost}),
                api.post.room.pushTurn(null, {
                    list: [
                        {
                            type: 'add-unit',
                            unitData: {
                                x: shop.get('x'),
                                y: shop.get('y'),
                                type: unitType,
                                userOrder: getMyOrder(game.get('users'))
                            }
                        }
                    ]
                })
            ])
            .then(() => {
                game.fetchData();
                game.get('turnMaster').fetchTurns();
            });
    }

    render() {
        const view = this;

        return <div>
            <h1>SHOP</h1>

            {Object.keys(unitGuide.type).map(unitType => <div key={unitType}>
                {JSON.stringify(unitGuide.type[unitType])}
                <button onClick={() => view.addUnit(unitType)}>
                    buy unit
                </button>
            </div>)}

        </div>;
    }
}

ShopView.propTypes = {
    setShopVisible: PropTypes.func.isRequired
};

export default connect(
    state => ({}),
    {
        ...shopAction
    }
)(ShopView);
