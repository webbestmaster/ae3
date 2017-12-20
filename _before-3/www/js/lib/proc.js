/* global setTimeout, clearTimeout*/
export default class Proc {
    constructor(func, period) {
        const proc = this;

        proc.isRunning = false;
        proc.func = func;
        proc.period = period;
        proc.timeoutId = null;

        proc.run();
    }

    run() {
        const proc = this;

        if (proc.isRunning) {
            return;
        }

        proc.isRunning = true;

        (function run() {
            if (!proc.isRunning) {
                return;
            }

            const result = proc.func();

            if (result && typeof result.then === 'function') {
                result.then(() => {
                    proc.timeoutId = setTimeout(run, proc.period);
                });
                return;
            }

            proc.timeoutId = setTimeout(run, proc.period);
        })();
    }

    destroy() {
        const proc = this;

        clearTimeout(proc.timeoutId);

        proc.isRunning = null;
        proc.func = null;
        proc.period = null;
        proc.timeoutId = null;
    }
}
