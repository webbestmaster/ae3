/**
 * Created by dmitry.turovtsov on 12.04.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

import BaseView from './../../core/base-view';
import {connect} from 'react-redux';

import * as viewAction from './action';

import * as groupListAction from './../group-list/action';
import SearchView from './../search';
import {TextField, SelectField, MenuItem} from 'material-ui';
import {SelectFieldGem} from './../../lib/gem-ui';
import viewConst from './const.json';
import classnames from 'classnames';
import * as sendMessageAction from './../send-message/action';
import chatMessageListConst from './../chat-message-list/const.json';

const optionStyleLeft = {
    width: '44%',
    marginLeft: '4%',
    marginRight: '2%',
    display: 'block'
};

const optionStyleRight = {
    width: '44%',
    marginLeft: '2%',
    marginRight: '4%',
    display: 'block'
};

class CreateGroupView extends BaseView {

    createNewGroup() {
        const view = this;

        const {
            includedInNewGroupUsersState,
            createNewGroup,
            resetIncludedUserInNewGroup,
            updateGroups,
            setViewVisible,
            setTypeTo
        } = view.props;

        const phones = includedInNewGroupUsersState.items;
        const name = view.refs.name.input.value;
        const type = view.refs.type.state.value;

        let newGroupId = '';

        createNewGroup({
            phones,
            name,
            type
        })
            .then(createNewGroupResult => {
                newGroupId = createNewGroupResult.id;
                resetIncludedUserInNewGroup();
                return updateGroups();
            })
            .then(() => {
                setViewVisible(false);
                setTypeTo(chatMessageListConst.chat.type.group, newGroupId);
            });
    }

    render() {
        const view = this;

        const {viewVisibleState, setViewVisible, toggleIncludingUserInNewGroup, updateContactListState} = view.props;

        if (!viewVisibleState.isVisible) {
            return null;
        }

        const {
            privateUsual, publicOpen, publicClosed, privateSingle, privateMarket
        } = viewConst.group.type;

        const phones = view.props.includedInNewGroupUsersState.items;

        return <div className="create-group">
            {/* {JSON.stringify(view.props.creatingNewGroupState)} */}

            <div className="create-group__header">
                <div className="create-group__back" onClick={() => setViewVisible(false)}/>
                <h2 className="create-group__name">Create group</h2>
            </div>
            <SearchView />
            <TextField style={optionStyleLeft}
                       className="create-group__option"
                       ref="name"
                       hintText="(recommended)"
                       floatingLabelText="Group name"
            />
            <SelectFieldGem style={optionStyleRight}
                            className="create-group__option"
                            ref="type"
                            defaultValue={privateUsual}
                            floatingLabelText="Group type">
                <MenuItem value={privateUsual} primaryText={privateUsual}/>
                <MenuItem value={publicOpen} primaryText={publicOpen}/>
                <MenuItem value={publicClosed} primaryText={publicClosed}/>
                <MenuItem value={privateSingle} primaryText={privateSingle}/>
                <MenuItem value={privateMarket} primaryText={privateMarket}/>
            </SelectFieldGem>

            <div className="create-group-list__wrapper">

                <div className="create-group-list__container">

                    <div className="contact" onClick={() => view.props.resetIncludedUserInNewGroup()}>

                        dasdasdas

                    </div>

                    {updateContactListState.items.map(item => {
                        const {phoneNumber, userName} = item;

                        const className = classnames('contact', {
                            'contact--is-active-contact': phones.indexOf(phoneNumber) !== -1
                        });

                        return <div className={className} key={phoneNumber}
                                    onClick={() => toggleIncludingUserInNewGroup(phoneNumber)}>
                            <div className="contact__avatar"/>
                            <h3 className="contact__name">{userName || phoneNumber}</h3>
                        </div>;
                    })}

                </div>
            </div>

            <button
                className="create-group__create-new-group"
                onClick={() => view.createNewGroup()}>
                Create group
            </button>

        </div>;
    }

}

CreateGroupView.propTypes = {
    updateContactListState: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            phoneNumber: PropTypes.string.isRequired,
            userName: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,

    viewVisibleState: PropTypes.shape({
        isVisible: PropTypes.bool.isRequired
    }).isRequired,

    includedInNewGroupUsersState: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,

    creatingNewGroupState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired
    }).isRequired,

    setIncludingUserInNewGroup: PropTypes.func.isRequired,
    toggleIncludingUserInNewGroup: PropTypes.func.isRequired,
    resetIncludedUserInNewGroup: PropTypes.func.isRequired,
    createNewGroup: PropTypes.func.isRequired,
    setViewVisible: PropTypes.func.isRequired,

    updateGroups: PropTypes.func.isRequired,
    setTypeTo: PropTypes.func.isRequired

};

export default connect(
    state => ({
        updateContactListState: state.mainState.contactsState.updateContactListState,
        viewVisibleState: state.mainState.createNewGroupState.viewVisibleState,
        includedInNewGroupUsersState: state.mainState.createNewGroupState.includedInNewGroupUsersState,
        creatingNewGroupState: state.mainState.createNewGroupState.creatingNewGroupState
    }),
    {
        ...viewAction,
        updateGroups: groupListAction.updateGroups,
        setTypeTo: sendMessageAction.setTypeTo
    }
)(CreateGroupView);
