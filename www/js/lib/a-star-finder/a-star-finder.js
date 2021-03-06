// @flow

/* global setTimeout */

import {isFunction, isString} from '../is/is';

type MapType = Array<string>;

export type PointType = [number, number];

export type PathType = Array<PointType>;

type SelfDataType = {|
    collectedCells: Array<string>,
|};

type AsyncCallbackType = (path: PathType | null) => void;

type OptionsType = {|
    noPath?: string,
    callBack?: AsyncCallbackType,
|};

export const defaultOptions: OptionsType = {
    noPath: '#',
};

const defaultSelfData: SelfDataType = {
    collectedCells: [],
};

// eslint-disable-next-line max-params
function getPathSelf(
    map: MapType,
    start: PointType,
    target: PointType,
    paths: Array<PathType>,
    options: OptionsType,
    selfData: SelfDataType
): PathType | null {
    // eslint-disable-next-line max-params
    const solution = checkPathsForSolution(paths, target);

    if (solution !== null) {
        return solution;
    }

    const newPaths = createPathsFromList(map, paths, options, selfData);

    if (newPaths.length === 0) {
        return null;
    }

    return getPathSelf(map, start, target, newPaths, options, selfData);
}

// eslint-disable-next-line max-params
function getPathAsyncSelf(
    map: MapType,
    start: PointType,
    target: PointType,
    paths: Array<PathType>,
    options: OptionsType,
    selfData: SelfDataType
) {
    const solution = checkPathsForSolution(paths, target);

    if (solution !== null && isFunction(options.callBack)) {
        options.callBack(solution);
        return;
    }

    const newPaths = createPathsFromList(map, paths, options, selfData);

    if (newPaths.length === 0 && isFunction(options.callBack)) {
        options.callBack(null);
        return;
    }

    setTimeout(() => {
        getPathAsyncSelf(map, start, target, newPaths, options, selfData);
    }, 0);
}

function checkPathsForSolution(paths: Array<PathType>, target: PointType): PathType | null {
    const len = paths.length;
    const targetX = target[0];
    const targetY = target[1];
    let ii = 0;
    let lastCell = null;
    let path = null;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < len; ii += 1) {
        path = paths[ii];
        lastCell = path[path.length - 1];
        if (lastCell[0] === targetX && lastCell[1] === targetY) {
            return path;
        }
    }

    return null;
}

// eslint-disable-next-line max-statements
function createPaths(map: MapType, path: PathType, options: OptionsType, selfData: SelfDataType): Array<PathType> {
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

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < len; ii += 1) {
        cell = cells[ii];
        cellMask = [cell[0], cell[1]].join('-');
        if (!collectedCells.includes(cellMask)) {
            collectedCells.push(cellMask);
            newPath = clone(path);
            newPath.push(cell);
            newPaths.push(newPath);
        }
    }

    return newPaths;
}

function createPathsFromList(
    map: MapType,
    paths: Array<PathType>,
    options: OptionsType,
    selfData: SelfDataType
): Array<PathType> {
    const len = paths.length;
    const newPaths = [];
    const {push} = Array.prototype;
    let ii = 0;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < len; ii += 1) {
        Reflect.apply(push, newPaths, createPaths(map, paths[ii], options, selfData));
    }

    return newPaths;
}

function getNearCells(map: MapType, start: PointType, options: OptionsType): Array<PointType> {
    const startX = start[0];
    const startY = start[1];
    const disArray = [
        0,
        -1, // up
        1,
        0, // right
        0,
        1, // down
        -1,
        0, // left
    ];
    const disArrayLength = disArray.length;
    const result = [];
    const {noPath} = options;
    let ii = 0;
    // eslint-disable-next-line id-length
    let x = 0;
    // eslint-disable-next-line id-length
    let y = 0;
    let cell = null;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < disArrayLength; ii += 2) {
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

function getItem<T: string | PointType>(index: number, array: Array<T>): T | null {
    if (index >= 0 && index < array.length) {
        return array[index];
    }

    return null;
}

// eslint-disable-next-line id-length
function getCell(x: number, y: number, map: MapType): string | null {
    const line = getItem(y, map);

    if (line === null) {
        return null;
    }

    return getItem(x, stringToArray(line));
}

export function getPath(map: MapType, start: PointType, end: PointType, options?: OptionsType): PathType | null {
    return getPathSelf(
        map,
        start,
        end,
        [[start]],
        {
            noPath: options && isString(options.noPath) ? options.noPath : defaultOptions.noPath,
        },
        clone(defaultSelfData)
    );
}

export function getPathAsync(
    map: MapType,
    start: PointType,
    end: PointType,
    callBack: AsyncCallbackType,
    options?: OptionsType
) {
    getPathAsyncSelf(
        map,
        start,
        end,
        [[start]],
        {
            noPath: options && isString(options.noPath) ? options.noPath : defaultOptions.noPath,
            callBack,
        },
        // Object.assign({}, defaultOptions, options || {}, {callBack}),
        clone(defaultSelfData)
    );
}
