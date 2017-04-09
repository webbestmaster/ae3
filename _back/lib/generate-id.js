let currentId = Date.now();

module.exports = function () {
    currentId += 1;
    return currentId;
};
