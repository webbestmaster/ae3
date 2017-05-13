import React, {Component} from 'react';

export default class BaseView extends Component {
    constructor() {
        super();
        console.log('Created View ->', this.constructor.name);
        console.log(this);
    }

    render() {
        return <div>I am Base View</div>;
    }
}
