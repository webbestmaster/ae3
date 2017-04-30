/**
 * Created by dmitry.turovtsov on 18.04.2017.
 */

import PropTypes from 'prop-types';
import BaseView from './../core/base-view';
import {connect} from 'react-redux';

import {getUserData} from './action';

// import userModel from 'root/model/user';

class UserDataView extends BaseView {

    // componentDidMount() {
    // const view = this;
    // view.props.getUserData(userModel.getSessionId());
    // }

    render() {
        const view = this;

        return <div>

            <hr/>

            <h1>user data is here:</h1>

            <div>{view.props.userDataState.isInProgress ? 'in progress' : 'done'}</div>
            <div>{view.props.userDataState.name}</div>
            <div>{view.props.userDataState.phone}</div>

            <hr/>

        </div>;
    }

}

UserDataView.propTypes = {

    userDataState: PropTypes.shape({
        isInProgress: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired
    }).isRequired,
    getUserData: PropTypes.func.isRequired

};

export default connect(
    state => ({
        userDataState: state.userDataState.userDataState
    }),
    {
        getUserData
    }
)(UserDataView);
