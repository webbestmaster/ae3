/*global window*/
const win = window;
const doc = win.document;
const docElem = doc.documentElement;

const prefix = (function () {
    let styles = win.getComputedStyle(docElem, ''),
        pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1];
    return {
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
})();

const util = {

    prefix,

    copyHashMap: function (hashMap) {
        return JSON.parse(JSON.stringify(hashMap));
    },

    copyArrayOfArrays: function (arrayOfArrays) {

        let i = arrayOfArrays.length;
        const newArray = new Array(i);

        while (i--) {
            newArray[i] = arrayOfArrays[i].slice();
        }

        return newArray;

    },

    getXyOfCorner: function (corner, width, height, marginsArg = [0, 0, 0, 0]) {

        let x, y;

        const margin = util.paramsParser(marginsArg);
        const mTop = margin[0];
        const mRight = margin[1];
        const mBottom = margin[2];
        const mLeft = margin[3];

        switch (corner) {

            case 1:
                x = mLeft;
                y = mTop;
                break;
            case 2:
                x = width / 2;
                y = mTop;
                break;
            case 3:
                x = width - mRight;
                y = mTop;
                break;
            case 4:
                x = mLeft;
                y = height / 2;
                break;
            case 5:
                x = width / 2;
                y = height / 2;
                break;
            case 6:
                x = width - mRight;
                y = height / 2;
                break;
            case 7:
                x = mLeft;
                y = height - mBottom;
                break;
            case 8:
                x = width / 2;
                y = height - mBottom;
                break;
            case 9:
                x = width - mRight;
                y = height - mBottom;
                break;

            default:
                throw 'CAN NOT DEFINE CORNER'

        }

        return {x, y};

    },

    paramsParser: function (arr) {

        if (!Array.isArray(arr)) {
            return util.paramsParser([arr]);
        }

        const result = [0, 0, 0, 0];

        switch (arr.length) {

            case 1:
                result[0] = result[1] = result[2] = result[3] = arr[0];
                break;
            case 2:
                result[0] = result[2] = arr[0];
                result[1] = result[3] = arr[1];
                break;
            case 3:
                result[0] = arr[0];
                result[1] = result[3] = arr[1];
                result[2] = arr[2];
                break;
            case 4:
                result[0] = arr[0];
                result[1] = arr[1];
                result[2] = arr[2];
                result[3] = arr[3];
                break;

            default:
                throw 'CAN NOT PARSE PARAMS'

        }

        return result;

    },

    // [start, end] - start and end value will be included
    getRandom(start, end) {

        if (end === undefined) {
            end = start;
            start = 0;
        }

        end += 1;

        return Math.floor(Math.random() * (end - start) + start);

    },

    shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    },

    copyShuffle(array) {
        return util.shuffle(util.copyHashMap(array));
    },

    addToGlobalScope(name, value) {

        console.log(win.gs = win.gs || {});

        console.warn(name, '- added to global scope (window.gs[\'' + name + '\'])', win.gs[name] = value);

    },

    detectFontSize() {

        const areaSize = docElem.clientWidth * docElem.clientHeight;
        const minAreaSize = 320 * 480; // iPhone4 css pixels
        const minFontSize = 16;
        const maxFontSize = 22;

        let fontSize = Math.round(minFontSize * areaSize / minAreaSize);

        fontSize = Math.max(minFontSize, fontSize);
        fontSize = Math.min(maxFontSize, fontSize);

        return fontSize;

    }

};

export default util;
