import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BaseView from './../../../core/base-view';
import * as createGroupAction from './../../create-group/action';
import createGroupConst from './../../create-group/const.json';
import * as contactsAction from './../action';
import * as sendMessageAction from './../../send-message/action';
import * as groupListAction from './../../group-list/action';
import chatMessageListConst from './../../chat-message-list/const.json';

class ContactView extends BaseView {

    startChatWith(phoneNumber) {
        // create group and redirect to group

        const {createNewGroup, setParentViewVisible, setTypeTo, updateGroups} = this.props;

        let groupId = '';

        createNewGroup({
            name: '',
            phones: [phoneNumber],
            type: createGroupConst.group.type.privateSingle
        }).then(newGroupData => {
            groupId = newGroupData.id;
            return updateGroups();
        }).then(() => {
            setParentViewVisible(false);
            setTypeTo(chatMessageListConst.chat.type.group, groupId);
        });
    }

    render() {
        const view = this;
        const {phoneNumber, userName} = view.props;

        return <div className="contact" onClick={() => view.startChatWith(phoneNumber)}>
            <div className="contact__avatar"/>
            <h3 className="contact__name">{userName || phoneNumber}</h3>
        </div>;
    }

}

ContactView.propTypes = {
    phoneNumber: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,

    createNewGroup: PropTypes.func.isRequired,
    setParentViewVisible: PropTypes.func.isRequired,
    setTypeTo: PropTypes.func.isRequired,
    updateGroups: PropTypes.func.isRequired

};

export default connect(
    state => ({}),
    {
        createNewGroup: createGroupAction.createNewGroup,
        setParentViewVisible: contactsAction.setViewVisible,
        setTypeTo: sendMessageAction.setTypeTo,
        updateGroups: groupListAction.updateGroups
    }
)(ContactView);
