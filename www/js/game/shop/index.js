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
        const user = findMe(game.get('users'));
        const {money} = user;

        view.props.setShopVisible(false);

        return Promise
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
            .then(() => Promise.all([
                game.fetchData(),
                game.get('turnMaster').fetchTurns()
            ]));
    }

    render() {
        const view = this;
        const {game} = view.props;
        const shop = game.get('shop');
        const user = findMe(game.get('users'));
        const {money} = user;

        return <div>
            <h1>SHOP</h1>
            {Object.keys(unitGuide.type).map(unitType => {
                const unitData = unitGuide.type[unitType];

                if (unitData.canNotBeBuy) {
                    return null;
                }

                const {cost} = unitData;

                if (cost <= money) {
                    return <div key={unitType}>
                        {JSON.stringify(unitGuide.type[unitType])}
                        <button onClick={() => view.addUnit(unitType)}>buy unit</button>
                    </div>;
                }

                return <div key={unitType} style={{opacity: 0.5}}>
                    {JSON.stringify(unitGuide.type[unitType])}
                    <button>not enough money</button>
                </div>;
            })}
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
