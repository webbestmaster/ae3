function getItem(index, array) {
    return index >= 0 && index < array.length && array[index];
}

function getCell(x, y, map) {
    const line = getItem(y, map);
    return line && getItem(x, line);
}

function pushToCurrentProgress(x, y, currentProgress) {
    let ii = 0;
    let cell = null;
    const length = currentProgress.length;

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
 * @param {Array} currentProgress - current progress
 * @return {Array} - array of cells, [[3,4], [2,3], [2,1]] // first x, then y
 */
function getAvailablePath(startX, startY, pathLength, map, currentProgress) {

    let ii = 0;
    const disArray = [0, -1, -1, 0, 1, 0, 0, 1];

    for (; ii < 8; ii += 2) {

        const x = startX + disArray[ii];
        const y = startY + disArray[ii + 1];

        const cell = getCell(x, y, map);

        if (cell !== false && pathLength >= cell) {
            pushToCurrentProgress(x, y, currentProgress);
            getAvailablePath(x, y, pathLength - cell, map, currentProgress)
        }
    }
    return currentProgress;
}

export const getPath = (x, y, pathLength, map) => getAvailablePath(x, y, pathLength, map, []);

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
