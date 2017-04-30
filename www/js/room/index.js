/* global setInterval*/
import React, {Component} from 'react';
import {connect} from 'react-redux';
import BaseView from './../base/base-view';

import user from './../model/user';

class Room extends BaseView {

    constructor() {
        super();

        this.state = {
            messages: []
        };
    }

    componentDidMount() {
        const view = this;

        user.enterRoom().then(() => console.log('added'));

        setInterval(() => {
            user.getAllChatMessages().then(messages => view.setState({messages: JSON.parse(messages)}));
        }, 2000);
    }

    render() {
        const view = this;

        return <div>

            {view.state.messages.map(message => <div key={JSON.stringify(message)}>{JSON.stringify(message)}</div>)}
            <input ref="text" type="text"/>
            <button onClick={() => user.sendChatMessage(view.refs.text.value)}>send message</button>
        </div>;
    }

}

// VIEW.propTypes = viewPropTypes;

export default connect(
    state => ({}),
    {}
)(Room);
