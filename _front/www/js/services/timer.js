const _mark = {};

export default {

    createMark(markId, time) {
        _mark[markId] = time === undefined ? Date.now() : time;

    },

    getTimeByMark(markId) {

        return _mark[markId];

    }

};
