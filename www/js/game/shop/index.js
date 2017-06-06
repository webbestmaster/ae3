import React from 'react';
import BaseView from '../../core/base-view';
import {connect} from 'react-redux';
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

    render() {
        const view = this;

        return <div>
            <h1>SHOP</h1>

            {Object.keys(unitGuide.type).map(unitType => <div key={unitType}>
                {JSON.stringify(unitGuide.type[unitType])}
            </div>)}

        </div>;
    }
}

ShopView.propTypes = {};

export default connect(
    state => ({}),
    {}
)(ShopView);
