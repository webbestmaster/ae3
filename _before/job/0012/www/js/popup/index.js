import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BaseView from './../core/base-view';

class PopupView extends BaseView {

    render() {
        const {children, toClose} = this.props;

        return <div className="popup-full-screen-wrapper">
            <div className="popup-full-screen-hiding"/>
            <div className="popup-container">
                <div className="popup-container__close" onClick={toClose}>&times;</div>
                {children}
            </div>
        </div>;
    }

}

PopupView.propTypes = {
    toClose: PropTypes.func.isRequired
};

export default connect(
    state => ({}),
    {}
)(PopupView);
