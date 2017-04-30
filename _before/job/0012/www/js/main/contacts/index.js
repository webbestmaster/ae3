/**
 * Created by dmitry.turovtsov on 10.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import * as viewAction from './action';
// import {Link} from 'react-router';
import routerConst from './../../router/const.json';
import _ from 'lodash';

import ContactView from './contact';
import SearchView from './../search';

// import classnames from 'classnames';

class ContactsView extends BaseView {

    /*
     componentDidMount() {

     const view = this;

     view.props
     .updateContactList()
     .then(result => console.log(result));

     }
     */

    render() {
        const view = this;

        const {updateContactListState, viewVisibleState, setViewVisible} = view.props;

        if (!viewVisibleState.isVisible) {
            return null;
        }

        return <div className="contact-list">
            {/* {updateContactListState.isInProgress && <div>in progress...</div>} */}
            <div className="contact-list__header">
                <div className="contact-list__back" onClick={() => setViewVisible(false)}/>
                <h2 className="contact-list__name">Contacts</h2>
            </div>
            <SearchView />

            <div className="contact-list__wrapper">
                <div className="contact-list__container">
                    {updateContactListState.items
                        .map(item => <ContactView
                                key={item.phoneNumber} {..._.pick(item, ['phoneNumber', 'userName'])} />

                            /*
                             <Link
                             style={{display: 'block'}}
                             key={item.phoneNumber}
                             to={routerConst.link.userContactPrefix + '/' + item.phoneNumber}>
                             {item.phoneNumber}, {item.userName}
                             </Link>
                             */
                        )}
                </div>
            </div>
            <button
                className="contact-list__add-new-contact"
                onClick={() => view.props.router.push(routerConst.link.addContact)}>
                Add new contact
            </button>
        </div>;
    }

}

ContactsView.propTypes = {

    router: PropTypes.object.isRequired,

    viewVisibleState: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired
    }).isRequired,

    updateContactListState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            phoneNumber: PropTypes.string.isRequired,
            userName: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,

    updateContactList: PropTypes.func.isRequired,
    setViewVisible: PropTypes.func.isRequired

};

export default connect(
    state => ({
        updateContactListState: state.mainState.contactsState.updateContactListState,
        viewVisibleState: state.mainState.contactsState.viewVisibleState
    }),
    {
        ...viewAction
    }
)(ContactsView);
