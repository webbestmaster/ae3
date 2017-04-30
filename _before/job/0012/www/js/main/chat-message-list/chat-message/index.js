/**
 * Created by dmitry.turovtsov on 11.04.2017.
 */

import React from 'react';
// import {Link} from 'react-router';
import PropTypes from 'prop-types';

// import appConst from './../../../../app-const.json';
import BaseView from './../../../core/base-view';
import {connect} from 'react-redux';

import moment from 'moment';
import classnames from 'classnames';

import userModel from './../../../model/user';

class ChatMessageView extends BaseView {

    render() {
        const {sender, isLocalFirst, text, receiveTime} = this.props;

        const className = classnames('message', {
            'message--from-me': userModel.getPhoneNumber() === sender,
            'message--local-first': isLocalFirst
        });

        return <div className={className}>
            <p className="message__text">{text}</p>
            <span className="message__receive-time">{moment(receiveTime).format('HH:mm')}</span>
{/*
            <span className="message__sending-state">{props.isInProgress ? 'sending...' : 'done'}</span>
*/}
        </div>;
    }

}

ChatMessageView.propTypes = {
    isLocalFirst: PropTypes.bool.isRequired,
    viewId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    toUser: PropTypes.string.isRequired,
    toGroup: PropTypes.string.isRequired,
    isInProgress: PropTypes.oneOf([0, 1]).isRequired,
    sendTime: PropTypes.number.isRequired,
    receiveTime: PropTypes.number.isRequired
};

export default connect(
    state => ({}),
    {}
)(ChatMessageView);
