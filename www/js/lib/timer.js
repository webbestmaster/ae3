/* global setTimeout */

module.exports = function timer(count, period, func) {
    if (count === 0) {
        func(count);
        return;
    }

    setTimeout(() => timer(count - 1, period, func), period);
    func(count);
};
