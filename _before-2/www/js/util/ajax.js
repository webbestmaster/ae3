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

export default {
    send(url, method, params) {
        return new Promise(resolve => send(url, method, params, resolve));
    },
    get(url, params) {
        return this.send(url, 'GET', params);
    },
    post(url, params) {
        return this.send(url, 'POST', params);
    }
};
