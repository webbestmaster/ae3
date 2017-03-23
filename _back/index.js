const FsServer = require('fs-server');

const HTTP_PORT = process.env.PORT || 3000;

const fsServerConfig = {
    root: './../_front/dist/', // path to front-end part of site
    port: HTTP_PORT // optional, recommended this, or do not use this field
    // page404: 'custom-404-page/index.html' // optional, path to custom 404 page
};

new FsServer(fsServerConfig) // create server with config
        .run(); // create server with config and run
