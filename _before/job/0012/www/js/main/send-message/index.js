/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';

import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import * as chatMessageListAction from './../chat-message-list/action';
import chatMessageListConst from './../chat-message-list/const.json';

class SendMessageView extends BaseView {

    sendMessage() {
        const view = this;
        const textInput = view.refs.text;
        const text = textInput.value;
        const {type, to} = view.props.sendMessageReceiverState;

        textInput.value = '';

        view.props.addMessage(text, type, to);
    }

    onSubmit(evt) {
        this.sendMessage();
        evt.preventDefault();
    }

    render() {
        const view = this;

        const {to} = view.props.sendMessageReceiverState;

        if (to === chatMessageListConst.chat.none) {
            return <div className="send-message">
                <h1 style={{textAlign: 'center'}}>start messaging with your friends</h1>
            </div>;
        }

        return <form onSubmit={evt => view.onSubmit(evt)} className="send-message">
            <div className="send-message__input-position">
                <input className="send-message__input" ref="text" type="text" placeholder="input message..."/>
            </div>
            <button className="send-message__send"/>
        </form>;
    }

}

SendMessageView.propTypes = {

    sendMessageReceiverState: PropTypes.shape({
        type: PropTypes.oneOf([
            chatMessageListConst.chat.type.group
            // chatMessageListConst.chat.type.user
        ]).isRequired,
        to: PropTypes.string.isRequired
    }).isRequired,

    addMessage: PropTypes.func.isRequired

};

export default connect(
    state => ({
        sendMessageReceiverState: state.mainState.sendMessageState.sendMessageReceiverState
    }),
    {
        addMessage: chatMessageListAction.addMessage
    }
)(SendMessageView);
