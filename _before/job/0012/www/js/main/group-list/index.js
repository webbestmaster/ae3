/**
 * Created by dmitry.turovtsov on 13.04.2017.
 */

import React from 'react';
// import {Link} from 'react-router';
import PropTypes from 'prop-types';
// import _ from 'lodash';

// import appConst from 'root/app-const.json';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import {updateGroups} from './action';
import GroupView from './group';
import SearchView from './../search';

class GroupListView extends BaseView {

    /*
     componentDidMount() {
     const view = this;
     view.props.updateGroups();
     }
     */

    render() {
        const view = this;

        const {props} = view;

        const messages = props.messagesState.items;

        const items = props.groupListItemsState.items.sort((itemA, itemB) => sortGroupsRule(itemA, itemB, messages));

        return <div className="group-list">
            <SearchView />
            <div className="group-list--container">
                {/* <span>groups
                    <span>{view.props.groupListItemsState.isInProgress && 'in progress...'}</span>
                 </span> */}
                {items.map(item => <GroupView key={item.id} id={item.id}/>)}
            </div>
        </div>;
    }

}

GroupListView.propTypes = {

    groupListItemsState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string
        })).isRequired
    }).isRequired,

    messagesState: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            sendTime: PropTypes.number.isRequired,
            receiveTime: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
            isInProgress: PropTypes.oneOf([0, 1]).isRequired
        })).isRequired
    }).isRequired,

    updateGroups: PropTypes.func.isRequired
};

export default connect(
    state => ({
        groupListItemsState: state.mainState.groupListState.groupListItemsState,
        messagesState: state.mainState.chatMessageListState.messagesState
    }),
    {
        updateGroups
    }
)(GroupListView);

// helper
function getLastMessageOfGroup(groupId, messages) {
    const sortedMessages = messages
        .filter(message => message.toGroup === groupId)
        .sort((itemA, itemB) => {
            if (itemA.receiveTime && itemB.receiveTime) {
                return itemB.receiveTime - itemA.receiveTime;
            }
            return itemB.sendTime - itemA.sendTime;
        });

    return sortedMessages.length ? sortedMessages[0] : null;
}

function sortGroupsRule(itemA, itemB, messages) {
    const defaultMessage = {receiveTime: 0, sendTime: 0};
    const lastMessageA = getLastMessageOfGroup(itemA.id, messages) || defaultMessage;
    const lastMessageB = getLastMessageOfGroup(itemB.id, messages) || defaultMessage;

    if (lastMessageA.receiveTime && lastMessageB.receiveTime) {
        return lastMessageB.receiveTime - lastMessageA.receiveTime;
    }

    return lastMessageB.sendTime - lastMessageA.sendTime;
}
