const _mark = {};

export default {

    createMark(markId, time) {
        if (time === undefined) {
            time = Date.now();
        }

        _mark[markId] = time;

    },

    getTimeByMark(markId) {

        return _mark[markId];

    }

}
