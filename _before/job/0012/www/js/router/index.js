import React, {Component} from 'react';
import {Router, Route, IndexRoute} from 'react-router';

import routerConst from './const.json';

import App from './../app';
import HomeView from './../home';

import MainView from './../main';
// import ContactView from './../main/contact/';
import AddContactView from './../main/add-contact/';
// import SendMessageView from 'root/chat-with-group/';
// import CreateGroupView from './../main/create-group/';

export default class AppRouter extends Component {

    render() {
        return <Router history={this.props.history}>
            <Route path={routerConst.link.root} component={App}>
                <IndexRoute component={HomeView}/>
                <Route path={routerConst.link.main} component={MainView}>
                    <Route path={routerConst.link.addContact} component={AddContactView}/>

                    {/* <Route path={routerConst.link.userContact} component={ContactView}/> */}
                    {/* <Route path={appConst.link.chatWith} component={SendMessageView}/> */}
                    {/* <Route path={routerConst.link.createGroup} component={CreateGroupView}/> */}

                </Route>
            </Route>
        </Router>;
    }

}
