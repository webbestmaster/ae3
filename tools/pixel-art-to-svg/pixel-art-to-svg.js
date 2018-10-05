/* global __dirname */

const fs = require('fs'); // eslint-disable-line id-length
const pixelArtToSvg = require('pixel-art-2-svg');

const pathToSrc = 'png';
const pathToSvg = 'svg';

// eslint-disable-next-line id-match
const cwd = __dirname;

async function convert(imageName) {
    return new Promise(async (resolve, reject) => {
        console.log('start:', imageName);

        const svgString = await pixelArtToSvg(cwd + '/' + pathToSrc + '/' + imageName);

        fs.writeFile(
            cwd + '/' + pathToSvg + '/' + imageName.replace('.png', '') + '.svg',
            svgString,
            'utf-8',
            () => {
                resolve();
                console.log('finish:', imageName);
            }
        );
    });
}

fs.readdir(pathToSrc, async (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    // eslint-disable-next-line no-loops/no-loops
    while (files.length) {
        await convert(files.pop());
    }
});
