import timer from './../lib/timer';
const viewConst = require('./const.json');

export function setState(payload) {
    return {
        type: viewConst.type.setState,
        payload
    };
}

export function resetState() {
    console.warn('THIS IS NOT delete all props');
    // TODO: fix this!
    return {
        type: viewConst.type.setState,
        payload: {
            users: [],
            startGameTimer: 10
        }
    };
}

export function startTimer() {
    return dispatch => timer(
        9,
        1e3,
        count => dispatch(setState({startGameTimer: count})),
        () => console.log('the game has begun')
    );
}
