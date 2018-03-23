// @flow

/* global setTimeout */

const defaultOptions = {
    noPath: '#'
};

const defaultSelfData = {
    collectedCells: []
};

module.exports.getPath = (map, start, end, options) =>
    getPath(
        map,
        start,
        end,
        [[start]],
        Object.assign({}, defaultOptions, options || {}),
        clone(defaultSelfData)
    );

module.exports.getPathAsync = (map, start, end, callBack, options) =>
    getPathAsync(
        map,
        start,
        end,
        [[start]],
        Object.assign({}, defaultOptions, options || {}, {callBack}),
        clone(defaultSelfData)
    );

function getPath(map, start, target, paths, options, selfData) { // eslint-disable-line max-params
    const solution = checkPathsForSolution(paths, target);

    if (solution !== null) {
        return solution;
    }

    const newPaths = createPathsFromList(map, paths, options, selfData);

    if (newPaths.length === 0) {
        return null;
    }

    return getPath(map, start, target, newPaths, options, selfData);
}

function getPathAsync(map, start, target, paths, options, selfData) { // eslint-disable-line max-params
    const solution = checkPathsForSolution(paths, target);

    if (solution !== null) {
        options.callBack(solution);
        return;
    }

    const newPaths = createPathsFromList(map, paths, options, selfData);

    if (newPaths.length === 0) {
        options.callBack(null);
        return;
    }

    setTimeout(() => getPathAsync(map, start, target, newPaths, options, selfData), 0);
}

function checkPathsForSolution(paths, target) {
    const len = paths.length;
    const targetX = target[0];
    const targetY = target[1];
    let ii = 0;
    let lastCell = null;
    let path = null;

    for (; ii < len; ii += 1) {
        path = paths[ii];
        lastCell = path[path.length - 1];
        if (lastCell[0] === targetX && lastCell[1] === targetY) {
            return path;
        }
    }

    return null;
}

function createPaths(map, path, options, selfData) {
    const pathLength = path.length;
    const newPaths = [];
    const {collectedCells} = selfData;
    const lastCell = getItem(pathLength - 1, path);
    const cells = getNearCells(map, lastCell, options);
    const len = cells.length;
    let cell = null;
    let cellMask = '';
    let ii = 0;
    let newPath = null;

    for (; ii < len; ii += 1) {
        cell = cells[ii];
        cellMask = [cell[0], cell[1]].join('-');
        if (collectedCells.indexOf(cellMask) === -1) {
            collectedCells.push(cellMask);
            newPath = clone(path);
            newPath.push(cell);
            newPaths.push(newPath);
        }
    }

    return newPaths;
}

function createPathsFromList(map, paths, options, selfData) {
    const len = paths.length;
    const newPaths = [];
    const {push} = Array.prototype;
    let ii = 0;

    for (; ii < len; ii += 1) {
        Reflect.apply(
            push,
            newPaths,
            createPaths(map, paths[ii], options, selfData)
        );
    }

    return newPaths;
}

function getNearCells(map, start, options) {
    const startX = start[0];
    const startY = start[1];
    const disArray = [
        0, -1,  // up
        1, 0,   // right
        0, 1,   // down
        -1, 0   // left
    ];
    const result = [];
    const {noPath} = options;
    let ii = 0;
    let x = 0;
    let y = 0;
    let cell = null;

    for (; ii < 8; ii += 2) {
        x = startX + disArray[ii];
        y = startY + disArray[ii + 1];
        cell = getCell(x, y, map);
        if (cell !== false && cell !== noPath) {
            result.push([x, y]);
        }
    }

    return result;
}

// helpers
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getItem(index, array) {
    return index >= 0 && index < array.length && array[index];
}

function getCell(x, y, map) {
    const line = getItem(y, map);

    return line && getItem(x, line);
}
