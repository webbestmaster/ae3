module.exports = function requestBodyParser(request, succes, error) {

    // TODO: add on error and on close

    let body = '';

    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function () {
        succes(body);
    });

};
