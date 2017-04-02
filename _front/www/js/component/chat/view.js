import React, {Component, PropTypes} from 'react';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
// import api from './../../api';
// import ajax from './../../lib/internal/ajax';
// import {Link} from 'react-router';
// import appConst from './../../const';
import {userModel} from './../../api/user-model';
import {chat} from './../../api/chat';
import {addMessage} from './action';

class Chat extends BaseView {

    componentWillMount() {

        const view = this;

        userModel.getWebSocket().addEventListener('message', view.props.addMessage, false);

    }

    componentWillUnmount() {

        const view = this;

        {
            // just reinsurance
            const socket = userModel.getWebSocket();
            if (socket) {
                socket.removeEventListener('message', view.props.addMessage, false);
            }
        }



    }

    render() {

        return <div>

            <h1>__chat_is_here__</h1>

            <h2>__here is a list of connection, players and etc...__</h2>


            {this.props.chatMessages.messages.list.map((message, index) => <div key={index}>{JSON.stringify(message)}</div>)}

            <input ref="text-input" type="text"/>

            <button onClick={() => chat.sendMessage(
                this.refs['text-input'].value,
                userModel
            )}> send message </button>

        </div>;

    }

}

Chat.propTypes = {
    chatMessages: PropTypes.object.isRequired,
    addMessage: PropTypes.func.isRequired
};

export default connect(
    state => ({
        chatMessages: state.chatMessages
    }),
    {
        addMessage
    }
)(Chat);
