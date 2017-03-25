function send(url, method, params, success, error) {

    const xhr = new window.XMLHttpRequest();

    xhr.onreadystatechange = function () {

        if (xhr.readyState !== 4) {
            return;
        }

        xhr.onreadystatechange = null;

        success(xhr.responseText);

    };

    xhr.open(method, url, true);

    const body = Object
        .keys(params || {})
        .map(key => key + '=' + encodeURIComponent(params[key]))
        .join('&');

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(body);

}

const ajax = {
    send(url, method, params) {
        return new Promise((resolve, reject) => send(url, method, params, resolve, reject));
    },
    get(url, params) {
        return ajax.send(url, 'GET', params);
    },
    post(url, params) {
        return ajax.send(url, 'POST', params);
    }
};

export default ajax;
