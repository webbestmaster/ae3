function send(url, method, params, success) {
    const xhr = new window.XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
            return;
        }

        xhr.onreadystatechange = null;

        success(xhr.responseText);
    };

    xhr.open(method, url, true);
    xhr.send(params ? JSON.stringify(params) : null);
}

const ajax = {
    send: (url, method, params) => new Promise(resolve => send(url, method, params, resolve)),
    get: (url, params) => ajax.send(url, 'GET', params),
    post: (url, params) => ajax.send(url, 'POST', params)
};

export default ajax;
