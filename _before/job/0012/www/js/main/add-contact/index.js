/**
 * Created by dmitry.turovtsov on 07.04.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../../core/base-view';
import {connect} from 'react-redux';
import {addPhoneNumber} from './action';
import * as contactsGem4meAction from './../contacts/action';
import PopupView from './../../popup/';

class AddContactView extends BaseView {

    addPhoneNumber() {
        const view = this;

        const contactName = view.refs.contactName.refs.input.value;
        const contactPhone = view.refs.contactPhone.refs.input.value;

        view.props
            .addPhoneNumber({
                contactName,
                contactPhone
            })
            .then(() => view.props.updateContactGem4emList())
            .catch(evt => console.error(evt))
            .then(view.props.router.goBack);
    }

    render() {
        const view = this;
        const {isInProgress} = view.props.addPhoneNumberState;

        return <PopupView toClose={view.props.router.goBack}>
            <div className="add-contact">
                {isInProgress ?
                    <h3 className="add-contact__header">In progress...</h3> :
                    <h3 className="add-contact__header">Add new contact</h3>
                }
                <LabelView ref="contactName" placeholder="Name"/>
                <LabelView ref="contactPhone" placeholder="Phone number"/>

            </div>

            <div className="add-contact__submit-button" onClick={() => view.addPhoneNumber()}>Save</div>

        </PopupView>;
    }

}

AddContactView.propTypes = {

    router: PropTypes.object.isRequired,

    addPhoneNumberState: PropTypes.object.isRequired,

    addPhoneNumber: PropTypes.func.isRequired,
    updateContactGem4emList: PropTypes.func.isRequired

};

export default connect(
    state => ({
        addPhoneNumberState: state.mainState.addContactState.addPhoneNumberState
    }),
    {
        addPhoneNumber,
        updateContactGem4emList: contactsGem4meAction.updateContactList
    }
)(AddContactView);

// helper
class LabelView extends BaseView {

    componentDidMount() {
        this.onBlur();
    }

    onChange() {
        const view = this;
        const {onChange} = view.props;

        if (typeof onChange === 'function') {
            onChange(view.refs.wrapper.value);
        }
    }

    onFocus() {
        this.refs.wrapper.classList.add('live-input__label--active');
    }

    onBlur() {
        const {wrapper, input} = this.refs;

        if (input.value) {
            wrapper.classList.add('live-input__label--active');
        } else {
            wrapper.classList.remove('live-input__label--active');
        }
    }

    render() {
        const view = this;
        const {placeholder, defaultValue, type = 'text'} = view.props;

        return <label ref="wrapper" className="live-input__label">
            <input ref="input" type={type} className="live-input__input"
                   onChange={() => view.onChange()}
                   onBlur={() => view.onBlur()}
                   onFocus={() => view.onFocus()}
                   defaultValue={defaultValue}/>
            <span className="live-input__normal-underline"/>
            <span className="live-input__focus-underline"/>
            <span className="live-input__text">{placeholder}</span>
        </label>;
    }

}

LabelView.propTypes = {
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number']),
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOf([PropTypes.string, PropTypes.number])
};
