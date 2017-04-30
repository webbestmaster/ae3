/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import React from 'react';
// import {Link} from 'react-router';
import PropTypes from 'prop-types';

import appConst from './../../app-const.json';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import ChatMessageView from './chat-message';
import userModel from './../../model/user';
import * as createGroupAction from './../create-group/action';
import createGroupConst from './../create-group/const.json';
import viewConst from './const.json';

class ChatMessageListView extends BaseView {

    componentDidMount() {
        // group.private.single
        const view = this;
        const {createNewGroup} = view.props;
        const {type, to} = view.props.sendMessageReceiverState;

        console.log(this);

/*
        if (type === viewConst.chat.type.user) {

            createNewGroup({
                phones: [userModel.getPhoneNumber(), to],
                type: createGroupConst.group.type.privateSingle
            });

            // .then(result =>
            //     view.props.router.replace(
            //         appConst.router.path.chatWith + '/' + appConst.chat.type.group + '/' + result.id
            //     )
            // );

        }
*/
    }

    render() {
        const view = this;

        const {type, to} = view.props.sendMessageReceiverState;

        if (viewConst.chat.type.group !== type) {
            return <h1>wait for group creating...</h1>;
        }

        const items = view.props.messagesState.items
            .filter(item => item.toGroup === to)
            .sort((itemA, itemB) => {
                if (itemA.receiveTime && itemB.receiveTime) {
                    return itemA.receiveTime - itemB.receiveTime;
                }
                return itemA.sendTime - itemB.sendTime;
            });

        return <div className="chat-message-list">
            <div className="chat-message-list--container">

                {items.map((item, ii, arr) => {
                    const isLocalFirst = ii === 0 || item.sender !== arr[ii - 1].sender;

                    const {text, isInProgress, sendTime, receiveTime, sender, toGroup, toUser, viewId} = item;

                    return <ChatMessageView key={viewId} {...{
                        isLocalFirst,
                        viewId,
                        text,
                        sender,
                        toGroup,
                        toUser,
                        isInProgress,
                        sendTime,
                        receiveTime
                    }} />;
                })}
            </div>
        </div>;
    }

}

ChatMessageListView.propTypes = {
    // router: PropTypes.object.isRequired,

    messagesState: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            viewId: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            sender: PropTypes.string.isRequired,
            toUser: PropTypes.string.isRequired,
            toGroup: PropTypes.string.isRequired,
            isInProgress: PropTypes.oneOf([0, 1]).isRequired,
            sendTime: PropTypes.number.isRequired,
            receiveTime: PropTypes.number.isRequired
        })).isRequired
    }).isRequired,

    sendMessageReceiverState: PropTypes.shape({
        type: PropTypes.oneOf([
            viewConst.chat.type.group
            // viewConst.chat.type.user
        ]).isRequired,
        to: PropTypes.string.isRequired
    }).isRequired,

    createNewGroup: PropTypes.func.isRequired

};

export default connect(
    state => ({
        messagesState: state.mainState.chatMessageListState.messagesState,
        sendMessageReceiverState: state.mainState.sendMessageState.sendMessageReceiverState
    }),
    {
        createNewGroup: createGroupAction.createNewGroup
    }
)(ChatMessageListView);
