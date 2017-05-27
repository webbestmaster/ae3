function send(url, method, params, resolve, reject) {
    const xhr = new window.XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            return;
        }

        xhr.onreadystatechange = null;
        if (xhr.getResponseHeader('content-type') === 'application/json') {
            const result = JSON.parse(xhr.responseText);

            if (result.hasOwnProperty('error')) {
                reject(result);
            } else {
                resolve(result);
            }

            return;
        }

        resolve(xhr.responseText);
    };

    xhr.open(method, url, true);
    xhr.send(params ? JSON.stringify(params) : null);
}

const ajax = {
    send: (url, method, params) =>
        new Promise((resolve, reject) =>
            send(url, method, params, resolve, reject)),
    get: (url, params) => ajax.send(url, 'GET', params),
    post: (url, params) => ajax.send(url, 'POST', params)
};

export default ajax;
