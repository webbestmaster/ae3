import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';

import GroupListView from './group-list/';
import ContactsView from './contacts/';
// import Public from './public/';
// import {Link} from 'react-router';
// import appConst from './../app-const.json';

import {setWatchingMessages} from './action';
import {getUserData} from './../user-data/action';
import {initDb, getTables} from './../module/db/action';
import userModel from './../model/user';
import dbConst from './../module/db/const.json';
// import UserData from 'rootuser-data';
import generateId from './../lib/generate-id';
import HeaderView from './header';

import SendMessageView from './send-message/';
import ChatMessageListView from './chat-message-list';
import {updateContactList} from './contacts/action';
import CreateGroupView from './../main/create-group/';

// import routerConst from './../router/const.json';

class MainView extends BaseView {

    componentDidMount() {
        const view = this;

        view.props.updateContactList().then(contactListData => console.log(contactListData));

        view.props
            .initDb(dbConst.dbNamePrefix + userModel.getPhoneNumber())
            .then(view.props.getTables)
            .then(savedMessages => {
                const savedMessagesList = savedMessages.sent.concat(savedMessages.received)
                    .map(message => ({...message, viewId: generateId()}));

                view.props.setWatchingMessages(true, savedMessagesList);
            })
            .catch(evt => {
                console.error(evt);

                view.props.setWatchingMessages(true, []);
            });
    }

    render() {
        const view = this;
        const {props} = view;

        return <div className="main-view">

            <HeaderView/>

            <div className="main-left-part">
                <GroupListView/>
            </div>

            <div className="main-right-part">
                <ChatMessageListView/>
                <SendMessageView/>
            </div>

            {/* <hr className="clear-full"/> */}

            {/* <UserData /> */}

            {/* <h1>main view</h1> */}

            {/*
             <div style={{width: '33%', float: 'left'}}>
             <button>Chats</button>
             </div>
             */}

            <ContactsView router={view.props.router}/>
            <CreateGroupView/>

            {/*

             <div style={{width: '33%', float: 'left'}}>
             <button>ContactsView</button>
             </div>

             <div style={{width: '33%', float: 'left'}}>
             <button>Public</button>
             <Public/>
             </div>

             <hr style={{clear: 'both'}}/>

             <Link to={routerConst.link.addContact}> add contact </Link>
             <br/>
             <Link to={routerConst.link.createGroup}> create group </Link>
             */}

            {props.children}

        </div>;
    }

}

MainView.propTypes = {
    groupListItemsState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string,
            type: PropTypes.string.isRequired,
            admins: PropTypes.arrayOf(PropTypes.string).isRequired
        })).isRequired
    }).isRequired,

    setWatchingMessages: PropTypes.func.isRequired,
    initDb: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired,
    getTables: PropTypes.func.isRequired,
    updateContactList: PropTypes.func.isRequired

};

export default connect(
    state => ({
        groupListItemsState: state.mainState.groupListState.groupListItemsState
    }),
    {
        setWatchingMessages,
        initDb,
        getUserData,
        getTables,
        updateContactList
    }
)(MainView);
