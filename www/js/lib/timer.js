/* global setTimeout */

module.exports = function timer(count, period, func, callback) {
    if (count === 0) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    setTimeout(() => timer(count - 1, period, func, callback), period);
    func(count);
};
