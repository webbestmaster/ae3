const win = window;
const doc = win.document;

export default {

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = doc.createElement('script');

            script.setAttribute('async', '');
            script.setAttribute('defer', '');
            script.addEventListener('load', resolve, false);
            script.addEventListener('error', reject, false);
            script.src = src;
            doc.head.appendChild(script);
        });
    },

    globalify(name, value) {
        const propGlobalName = 'myGlobal';

        console.log(win[propGlobalName] = win[propGlobalName] || {});

        console.log(
            '--->',
            name,
            '- added to global scope (window.' + propGlobalName + '[\'' + name + '\'])',
            win[propGlobalName][name] = value
        );
    }

};