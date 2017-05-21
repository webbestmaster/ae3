import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {GameModel, gameModelAttr} from './model';
import {Dialog, FlatButton} from 'material-ui';
import isItMe from './../lib/is-it-me';
import api from './../user/api';

function getDefaultState() {
    return {
        changeTurnPopup: {
            isOpen: false,
            title: '',
            body: ''
        }
    };
}

class GameView extends BaseView {
    constructor() {
        super();

        const view = this;

        view.state = getDefaultState();
    }

    componentWillUnmount() {
        const view = this;

        view.state.model.destroy();
        view.setState(getDefaultState());
    }

    componentWillReceiveProps(nextProps) {
        this.state.model.set(nextProps.gameState.state);
    }

    showChangeTurnPopup() {
        const view = this;
        const {users, currentUserIndex} = view.state.model.getAllAttributes();
        const user = users[currentUserIndex];
        const {state} = view;

        state.changeTurnPopup.isOpen = true;

        if (isItMe(user)) {
            state.changeTurnPopup.title = 'Your turn!';
            state.changeTurnPopup.body = 'Good luck!';
        } else {
            state.changeTurnPopup.title = 'Not your turn!';
            state.changeTurnPopup.body = 'Good luck!';
        }

        view.setState(state);
    }

    handleCloseChangeTurnPopup() {
        const view = this;
        const {state} = view;

        state.changeTurnPopup.isOpen = false;
        view.setState(state);
    }

    componentDidMount() {
        const view = this;
        const model = new GameModel(view.props.gameState.state);

        view.state.model = model;

        model.onChange('currentUserIndex', view.showChangeTurnPopup, view);
        model.start();
    }

    render() {
        const view = this;

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => view.handleCloseChangeTurnPopup()}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => view.handleCloseChangeTurnPopup()}
            />
        ];

        return <div>
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => api.get.room.leaveTurn()}
            />
            <Dialog
                title={view.state.changeTurnPopup.title}
                actions={actions}
                modal={false}
                open={view.state.changeTurnPopup.isOpen}
                onRequestClose={() => view.handleCloseChangeTurnPopup()}>
                {view.state.changeTurnPopup.body}
            </Dialog>

            <h1>{JSON.stringify(view.props.gameState)}</h1>
        </div>;
    }
}

GameView.propTypes = {};

export default connect(
    state => ({
        gameState: state.gameState,
        userState: state.userState
    }),
    {}
)(GameView);
