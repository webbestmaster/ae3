const fs = require('fs'); // eslint-disable-line id-length
const pixel = require('pixel');
const svg = require('pixel-to-svg');

const pathToSrc = 'png';
const pathToSvg = 'svg';

async function convert(imageName) {
    return new Promise((resolve, reject) => {
        console.log('start:', imageName);
        pixel.parse(pathToSrc + '/' + imageName)
            .then(images => {
                const svgData = svg.convert(images[0])
                    .replace( // rgba to rgb
                        /fill="rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3})\)"/gi,
                        'fill="rgb($1,$2,$3)"'
                    )
                    .replace( // remove full black square
                        /<path fill="rgb\(0,0,0\)"[\s\S]+?\/>/,
                        ''
                    )
                    .replace( // remove <g/> tag
                        /<g>|<\/g>/gi,
                        ''
                    );

                const svgFileName = imageName.replace(/\.[\S]+?$/, '') + '.svg';

                fs.writeFile(pathToSvg + '/' + svgFileName, svgData, {encoding: 'utf8'}, err => {
                    if (err) {
                        console.log('error:', imageName);
                        console.error(err);
                        reject(err);
                        return;
                    }
                    console.log('done:', imageName);
                    resolve();
                });
                return true;
            })
            .catch(error => {
                console.error(error);
            });
    });
}

fs.readdir(pathToSrc, async (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    while (files.length) {
        await convert(files.pop());
    }
});


