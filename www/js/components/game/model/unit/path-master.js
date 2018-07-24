// @flow

type MapPathReduceType = Array<Array<number>>;
type MapNoPathType = Array<[number, number]>;
export type PathType = Array<[number, number]>; // need for export only
export type AvailablePathMapType = Array<[number, number]>;

function getItem<T:number | Array<number>>(index: number, array: Array<T>): T | null {
    if (index >= 0 && index < array.length) {
        return array[index];
    }

    return null;
}

function getCell(x: number, y: number, map: MapPathReduceType): number | null {
    const line = getItem(y, map);

    if (line === null) {
        return null;
    }

    return getItem(x, line);
}

function hasArrayCell(array: Array<[number, number]>, x: number, y: number): boolean {
    let ii = 0;
    let cell = null;
    const length = array.length;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < length; ii += 1) {
        cell = array[ii];
        if (cell[0] === x && cell[1] === y) {
            return true;
        }
    }

    return false;
}

function pushToCurrentProgress(x: number, y: number, mapNoPath: MapNoPathType, currentProgress: AvailablePathMapType) {
    let ii = 0;
    let cell = null;
    const length = currentProgress.length;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < length; ii += 1) {
        cell = currentProgress[ii];
        if (cell[0] === x && cell[1] === y) {
            return;
        }
    }

    currentProgress.push([x, y]);
}

/**
 *
 * @param {number} startX - start position X
 * @param {number} startY - start position Y
 * @param {number} pathLength - max available path length
 * @param {Array} map - array of arrays of numbers, [ [1,2,3], [3,4,5], [1,4,5]]
 * @param {Array} mapNoPath - array of arrays of numbers, [ [1,2,3], [3,4,5], [1,4,5]]
 * @param {Array} currentProgress - current progress
 * @return {Array} - array of cells, [[3,4], [2,3], [2,1]] // first x, then y
 */
function getAvailablePath(startX: number, // eslint-disable-line max-params
                          startY: number,
                          pathLength: number,
                          map: MapPathReduceType,
                          mapNoPath: MapNoPathType,
                          currentProgress: AvailablePathMapType): AvailablePathMapType {
    let ii = 0;
    const disArray = [0, -1, -1, 0, 1, 0, 0, 1];
    const disArrayLength = disArray.length;

    // eslint-disable-next-line no-loops/no-loops
    for (; ii < disArrayLength; ii += 2) {
        const x = startX + disArray[ii];
        const y = startY + disArray[ii + 1];

        const cell = getCell(x, y, map);

        if (cell !== null && pathLength >= cell && !hasArrayCell(mapNoPath, x, y)) {
            pushToCurrentProgress(x, y, mapNoPath, currentProgress);
            getAvailablePath(x, y, pathLength - cell, map, mapNoPath, currentProgress);
        }
    }
    return currentProgress;
}

export function getPath(startX: number,
                        startY: number,
                        pathLength: number,
                        map: MapPathReduceType,
                        mapNoPath: MapNoPathType): AvailablePathMapType {
    return getAvailablePath(startX, startY, pathLength, map, mapNoPath, []);
}

/*
 const arr = [
 [1, 2, 3, 3, 1],
 [2, 3, 1, 2, 1],
 [1, 2, 1, 2, 2],
 [1, 1, 2, 1, 1],
 [1, 2, 2, 2, 2]
 ];

 const availablePath = getAvailablePath(2, 2, 3, arr);

 console.log(availablePath)

 availablePath.forEach(xy => arr[xy[1]][xy[0]] = 0);

 console.log(arr);
 */
// console.log(getAvailablePath(2, 2, 2, arr));
