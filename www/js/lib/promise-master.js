/**
 * Created by dmitry.turovtsov on 02.05.2017.
 */

class PromiseMaster {
    constructor() {
        const master = this;

        master.list = [];
        master.isInProgress = false;
    }

    push(func) {
        const master = this;

        master.list.push(func);

        if (master.isInProgress) {
            return;
        }

        master.run();
    }

    run() {
        const master = this;

        if (master.list.length === 0) {
            master.isInProgress = false;
            return;
        }

        master.isInProgress = true;
        const first = master.list.shift();
        const result = first();

        if (typeof result.then === 'function') {
            result.then(() => master.runCallBack());
            return;
        }

        master.runCallBack();
    }

    runCallBack() {
        // window.setTimeout(() => this.run(), 0);
        window.requestAnimationFrame(() =>
            window.requestIdleCallback(() =>
                this.run()));
    }
}

export {PromiseMaster};
export default new PromiseMaster();
