import PropTypes from 'prop-types';

export default {

    screenState: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired
    }),

    onResizeScreen: PropTypes.func.isRequired

};
