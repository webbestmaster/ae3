const fs = require('fs');

class FileMaster {

    writeFile(path, content) {
        return new Promise((resolve, reject) =>
            fs.writeFile(path, content, 'utf-8', err =>
                err ? reject(err) : resolve(content)
            )
        );
    }

}

module.exports = FileMaster;
