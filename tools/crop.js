const PNGCrop = require('png-crop');

// if you don't know the image's dimension and want to crop for a point all the
// way til bottom right, just pass a big width/height
const config1 = {width: 100, height: 62, top: 95, left: 110};
// pass a path, a buffer or a stream as the input

function crop(imgPath, newImgName, config) {
    return new Promise((resolve, reject) =>
        PNGCrop.crop(imgPath, newImgName, config, err => err ? reject(err) : resolve())
    );
}

const list = [
    'soldier',
    'archer',
    'elemental',
    'sorceress',
    'wisp',
    'dire-wolf',
    'golem',
    'catapult',
    'dragon',
    '_empty_',
    'skeleton',
    'crystal',
    'galamar',
    'demon-lord',
    'valadorn',
    'saeth'
];

const size = 24;

const colors = ['black', 'blue', 'gray', 'green', 'red'];

colors.forEach(color => list.forEach(async (name, index) => {
    await crop('./unit-icons-' + color + '.png', './img/' + name + '-' + color + '-0.png', {
        width: size, height: size, top: 0, left: index * size
    });
    await crop('./unit-icons-' + color + '.png', './img/' + name + '-' + color + '-1.png', {
        width: size, height: size, top: size, left: index * size
    });
}));

