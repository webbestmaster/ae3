// Happy debugging!
export default (initialState, triggerType) =>
    (state = initialState, {type, payload}) =>
        type === triggerType ?
            {...state, ...payload} :
            state;
