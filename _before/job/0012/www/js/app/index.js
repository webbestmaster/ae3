import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {onResizeScreen} from './action';

class App extends Component {

    componentDidMount() {
        window.addEventListener('resize', this.props.onResizeScreen, false);
    }

    render() {
        const {props} = this;
        const {width, height} = props.screenState;

        return <div className="wrapper" style={{width: width + 'px', height: height + 'px'}}>
            {props.children}
        </div>;
    }

}

App.propTypes = {
    screenState: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }).isRequired,
    onResizeScreen: PropTypes.func.isRequired
};

export default connect(
    state => ({
        screenState: state.appState.screenState
    }),
    {
        onResizeScreen
    }
)(App);
