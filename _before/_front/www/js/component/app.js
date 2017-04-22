import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {resizeScreen, click} from './../action';
import {connect} from 'react-redux';

class App extends Component {

    componentDidMount() {
        window.addEventListener('resize', this.props.resizeScreen, false);
        // document.body.addEventListener('click', this.props.click, false);
    }

    render() {
        const props = this.props;
        const {width, height} = props.screen;
        return <div style={{width: width + 'px', height: height + 'px'}}>
            {props.children}
        </div>;
    }

}

App.propTypes = {
    screen: PropTypes.object.isRequired,
    resizeScreen: PropTypes.func.isRequired
    // click: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        screen: state.screen
    }),
    {
        resizeScreen
        // click
    }
)(App);
