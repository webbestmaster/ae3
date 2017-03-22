import appConst from './../const';

const initialState = {
    x: NaN,
    y: NaN
};

const CLICK = appConst.TYPE.CLICK;

console.log(CLICK);

export default function click(state = initialState, action) {

    if (action.type === CLICK) {
        console.log(CLICK, action.event);
        return {
            ...state,
            x: action.x,
            y: action.y
        };
    }

    return state;

}
