/**
 * Created by dmitry.turovtsov on 19.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';

import logo from './../../../style/i/header/logo.png';

import chatMessageListConst from './../chat-message-list/const.json';

import {getGroupName} from './../group-list/group/';
import * as contactsAction from './../contacts/action';
import * as createGroupAction from './../create-group/action';

class HeaderView extends BaseView {

    render() {
        const {
            sendMessageReceiverState,
            setContactsViewVisible,
            setCreateGroupViewVisible,
            groupListItemsState,
            updateContactListState
        } = this.props;

        const groupList = groupListItemsState.items;
        const contactList = updateContactListState.items;
        const groupName = getGroupName(sendMessageReceiverState.to, groupList, contactList);

        return <header className="main-header">
            <div className="main-header__logo-part">
                <img className="main-header__logo" src={logo} alt=""/>
                <button className="main-header__contacts" onClick={() => setContactsViewVisible(true)}/>
                <button className="main-header__create-new-group" onClick={() => setCreateGroupViewVisible(true)}/>
            </div>
            <div className="main-header__chat-part">
                <div className="main-header__image"/>
                <div className="main-header__short-info">
                    <h2 className="main-header__title">{groupName}</h2>
                </div>
                <div className="main-header__setting"/>
                <div className="main-header__search"/>
            </div>
        </header>;
    }

}

HeaderView.propTypes = {

    sendMessageReceiverState: PropTypes.shape({
        type: PropTypes.oneOf([
            chatMessageListConst.chat.type.group
            // chatMessageListConst.chat.type.user
        ]).isRequired,
        to: PropTypes.string.isRequired
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

    setContactsViewVisible: PropTypes.func.isRequired,
    setCreateGroupViewVisible: PropTypes.func.isRequired

};

export default connect(
    state => ({
        sendMessageReceiverState: state.mainState.sendMessageState.sendMessageReceiverState,
        groupListItemsState: state.mainState.groupListState.groupListItemsState,
        updateContactListState: state.mainState.contactsState.updateContactListState
    }),
    {
        setContactsViewVisible: contactsAction.setViewVisible,
        setCreateGroupViewVisible: createGroupAction.setViewVisible
    }
)(HeaderView);
