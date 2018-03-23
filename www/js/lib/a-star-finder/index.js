// @flow

/* global setTimeout */

type MapType = Array<string>;

type PointType = [number, number];

type PathType = Array<PointType>;

type SelfDataType = {|
    collectedCells: Array<string>
|};

type AsyncCallbackType = (path: PathType | null) => void;

type OptionsType = {|
    noPath?: string,
    callBack?: AsyncCallbackType
|};

const defaultOptions: OptionsType = {
    noPath: '#'
};

const defaultSelfData: SelfDataType = {
    collectedCells: []
};


module.exports.getPath = (map: MapType,
                          start: PointType,
                          end: PointType,
                          options?: OptionsType): PathType | null => {
    return getPath(
        map,
        start,
        end,
        [[start]],
        {
            noPath: options && typeof options.noPath === 'string' ? options.noPath : defaultOptions.noPath
        },
        clone(defaultSelfData)
    );
};

module.exports.getPathAsync = (map: MapType,
                               start: PointType,
                               end: PointType,
                               callBack: AsyncCallbackType,
                               options?: OptionsType) => {
    getPathAsync(
        map,
        start,
        end,
        [[start]],
        {
            noPath: options && typeof options.noPath === 'string' ? options.noPath : defaultOptions.noPath,
            callBack
        },
        // Object.assign({}, defaultOptions, options || {}, {callBack}),
        clone(defaultSelfData)
    );
};

function getPath(map: MapType, // eslint-disable-line max-params
                 start: PointType,
                 target: PointType,
                 paths: Array<PathType>,
                 options: OptionsType,
                 selfData: SelfDataType): PathType | null { // eslint-disable-line max-params
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

function getPathAsync(map: MapType, // eslint-disable-line max-params
                      start: PointType,
                      target: PointType,
                      paths: Array<PathType>,
                      options: OptionsType,
                      selfData: SelfDataType) {
    const solution = checkPathsForSolution(paths, target);

    if (solution !== null && typeof options.callBack === 'function') {
        options.callBack(solution);
        return;
    }

    const newPaths = createPathsFromList(map, paths, options, selfData);

    if (newPaths.length === 0 && typeof options.callBack === 'function') {
        options.callBack(null);
        return;
    }

    setTimeout(() => {
        getPathAsync(map, start, target, newPaths, options, selfData);
    }, 0);
}

function checkPathsForSolution(paths: Array<PathType>, target: PointType): PathType | null {
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

function createPaths(map: MapType, path: PathType, options: OptionsType, selfData: SelfDataType): Array<PathType> { // eslint-disable-line max-statements
    const pathLength = path.length;
    const newPaths = [];
    const {collectedCells} = selfData;
    const lastCell = getItem(pathLength - 1, path);

    if (lastCell === null) {
        return [];
    }

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

function createPathsFromList(map: MapType,
                             paths: Array<PathType>,
                             options: OptionsType,
                             selfData: SelfDataType): Array<PathType> {
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

function getNearCells(map: MapType, start: PointType, options: OptionsType): Array<PointType> {
    const startX = start[0];
    const startY = start[1];
    const disArray = [
        0, -1, // up
        1, 0, // right
        0, 1, // down
        -1, 0 // left
    ];
    const result = [];
    const {noPath} = options;
    let ii = 0;
    let x = 0; // eslint-disable-line id-length
    let y = 0; // eslint-disable-line id-length
    let cell = null;

    for (; ii < 8; ii += 2) {
        x = startX + disArray[ii];
        y = startY + disArray[ii + 1];
        cell = getCell(x, y, map);
        if (cell !== null && cell !== noPath) {
            result.push([x, y]);
        }
    }

    return result;
}

// helpers
function stringToArray(str: string): Array<string> {
    return str.split('');
}

function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

function getItem<T:string | PointType>(index: number, array: Array<T>): T | null {
    if (index >= 0 && index < array.length) {
        return array[index];
    }

    return null;
}

function getCell(x: number, y: number, map: MapType): string | null { // eslint-disable-line id-length
    const line = getItem(y, map);

    if (line === null) {
        return null;
    }

    return getItem(x, stringToArray(line));
}
