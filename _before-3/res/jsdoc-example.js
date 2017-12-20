/**
 *
 * @typedef {Object} PropertiesHash
 * @property {string} id - an ID.
 * @property {string} name - your name.
 *
 * @param {object} obj object
 *      @param {string} obj.sd1 object
 *      @param {string} obj.sd2 object
 * @param {PropertiesHash[]} arr - object
 * @param {number} num object
 * @param {number} str object
 * @return {number} just a number
 */
function draw(obj, arr, num, str) {
    console.log(obj.sd1);
    console.log(obj.sd2);
    console.log(arr[0]);
    console.log(num);
    console.log(str);
    return 1;
}

draw({sd1: '2', sd2: '3'}, [{id: 1}, {id: '2'}], 3, 2);
