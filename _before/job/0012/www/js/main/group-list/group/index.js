/**
 * Created by dmitry.turovtsov on 13.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';

import createGroupConst from './../../create-group/const.json';
import chatMessageListConst from './../../chat-message-list/const.json';

import BaseView from './../../../core/base-view';
import {connect} from 'react-redux';
import classnames from 'classnames';
import userModel from './../../../model/user';
import * as sendMessageAction from './../../send-message/action';
import _ from 'lodash';

class GroupView extends BaseView {

    render() {
        const view = this;
        const {id, setTypeTo} = view.props;

        const items = view.props.messagesState.items
            .filter(item => item.toGroup === id)
            .sort((itemA, itemB) => {
                if (itemA.receiveTime && itemB.receiveTime) {
                    return itemA.receiveTime - itemB.receiveTime;
                }
                return itemA.sendTime - itemB.sendTime;
            });

        const groupClassNames = classnames('group', {
            'group--is-current-group': view.props.sendMessageReceiverState.to === id
        });

        const groupList = view.props.groupListItemsState.items;
        const contactList = view.props.updateContactListState.items;
        const groupName = getGroupName(id, groupList, contactList);

        return <div className={groupClassNames} onClick={() => setTypeTo(chatMessageListConst.chat.type.group, id)}>
            <div className="group__avatar"/>
            <h3 className="group__name">{groupName}</h3>
            <span className="group__last-message-time">16.03.15</span>
            <LastMessageView {...{items}} />
        </div>;
    }

}

GroupView.propTypes = {

    id: PropTypes.string.isRequired,

    messagesState: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            sendTime: PropTypes.number.isRequired,
            receiveTime: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            isInProgress: PropTypes.oneOf([0, 1]).isRequired
        })).isRequired
    }).isRequired,

    groupListItemsState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
            type: PropTypes.string.isRequired,
            admins: PropTypes.arrayOf(PropTypes.string).isRequired
        })).isRequired
    }).isRequired,

    updateContactListState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            phoneNumber: PropTypes.string.isRequired,
            userName: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,

    sendMessageReceiverState: PropTypes.shape({
        to: PropTypes.string.isRequired
    }).isRequired,

    setTypeTo: PropTypes.func.isRequired

};

export default connect(
    state => ({
        messagesState: state.mainState.chatMessageListState.messagesState,
        groupListItemsState: state.mainState.groupListState.groupListItemsState,
        updateContactListState: state.mainState.contactsState.updateContactListState,
        sendMessageReceiverState: state.mainState.sendMessageState.sendMessageReceiverState
    }),
    {
        setTypeTo: sendMessageAction.setTypeTo
    }
)(GroupView);


// Helpers
class LastMessageView extends BaseView {

    render() {
        const {items} = this.props;

        const lastItem = items[items.length - 1] || {};

        const lastMessageItem = Object.assign(
            {text: '', isInProgress: 0},
            lastItem
        );

        const className = classnames('group__last-message-text', {
            'group__last-message-text--in-progress': lastMessageItem.isInProgress
        });

        let {text} = lastMessageItem;

        text = text.trim();

        const MAX_TEXT_LENGTH = 140;

        if (text.length > MAX_TEXT_LENGTH) {
            text = text.substr(0, MAX_TEXT_LENGTH) + '...';
        }

        return <p className={className}>{text}</p>;
    }

}

LastMessageView.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        isInProgress: PropTypes.oneOf([0, 1]).isRequired
    })).isRequired
};

function getMapFunctionByList(list) {
    return adminPhone => {
        const adminData = _.find(list, {phoneNumber: adminPhone});

        if (adminData) {
            return adminData.userName || adminData.phoneNumber;
        }
        return adminPhone;
    };
}

// TODO: refactor this
export function getGroupName(groupId, groupList, contactList) {
    const group = _.find(groupList, {id: groupId});

    if (!group) {
        return '';
    }

    if (group && group.name) {
        return group.name;
    }

    const userName = userModel.getName();
    const userPhoneNumber = userModel.getPhoneNumber();
    const {privateUsual, publicOpen, publicClosed, privateSingle, privateMarket} = createGroupConst.group.type;

    const groupType = group.type;

    if (groupType === privateSingle) {
        return group.admins
            .filter(adminPhone => adminPhone !== userPhoneNumber)
            .map(getMapFunctionByList(contactList))
            .join(', ');
    }

    if ([privateUsual, publicOpen, publicClosed, privateSingle, privateMarket].indexOf(groupType) !== -1) {
        const fullList = JSON.parse(JSON.stringify(contactList));

        fullList.push({
            phoneNumber: userPhoneNumber,
            userName
        });

        return group.admins
            .map(getMapFunctionByList(fullList))
            .join(', ');
    }

    throw new Error('ERROR: Can not detect group type');
}
