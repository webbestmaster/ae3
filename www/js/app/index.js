/* global window */
import React, {Component} from 'react';
import viewPropTypes from './prop-types';
import {onResizeScreen} from './action';
import {connect} from 'react-redux';

class App extends Component {

    componentDidMount() {

        window.addEventListener('resize', this.props.onResizeScreen, false);

    }

    render() {
        const props = this.props;
        const {width, height} = props.screenState;
        return <div style={{width: width + 'px', height: height + 'px'}}>
            {props.children}
        </div>;
    }

}

App.propTypes = viewPropTypes;

export default connect(
    state => ({
        screenState: state.appState.screenState
    }),
    {
        onResizeScreen
    }
)(App);
