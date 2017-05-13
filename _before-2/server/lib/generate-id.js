let currentId = Date.now();

module.exports = () => {
    currentId += 1;
    return String(currentId);
};
