import React from 'react';
import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {GameModel} from './model';
import {Dialog, FlatButton} from 'material-ui';
import {isItMe} from './../lib/me';
import api from './../user/api';
import {find} from 'lodash';
import ShopView from './shop';

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
        const {users, currentUserPublicId} = view.state.model.getAllAttributes();
        const user = find(users, {publicId: currentUserPublicId});
        const {state} = view;

        state.changeTurnPopup.isOpen = true;

        if (isItMe(user)) {
            state.changeTurnPopup.title = 'Your turn!';
            state.changeTurnPopup.body = 'Good luck!';
        } else {
            state.changeTurnPopup.title = 'Not your turn!';
            state.changeTurnPopup.body = 'Wait for other player!';
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

        // model.set({user: {
        //     publicId: view.props.userState.publicIdState.publicId
        // }});
        view.state.model = model;

        model.start().then(() => {
            // model.onChange('turnCounter', (now, before) => console.log('turnCounter', before, now), view);
            model.onChange('currentUserPublicId', () => {
                model.clearAllSquares();
                view.showChangeTurnPopup();
            }, view);
            model.onChange('users', function onUsersChange() {
                console.warn('users changed');
                console.warn(arguments);
            }, view);
            view.showChangeTurnPopup();
        });
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
            <h1>users</h1>
            <hr/>
            {view.props.gameState.state.users.map((user, ii) => <div key={ii}>
                {isItMe(user) ? <h1>{JSON.stringify(user)}</h1> : <p>{JSON.stringify(user)}</p>}
            </div>)}
            <hr/>
            <FlatButton
                label="Leave Turn"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => view.state.model.leaveTurn()}
            />
            <Dialog
                title={view.state.changeTurnPopup.title}
                actions={actions}
                modal={false}
                open={view.state.changeTurnPopup.isOpen}
                onRequestClose={() => view.handleCloseChangeTurnPopup()}>
                {view.state.changeTurnPopup.body}
            </Dialog>

            <h1 style={{display: 'none'}}>{JSON.stringify(view.props.gameState)}</h1>
            <div id="canvas-holder"/>

            {view.props.shopState.visibleState.isVisible && <ShopView game={view.state.model}/>}

        </div>;
    }
}

GameView.propTypes = {};

export default connect(
    state => ({
        gameState: state.gameState,
        userState: state.userState,
        shopState: state.gameState.shopState
    }),
    {}
)(GameView);
