import BaseModel from './../core/base-model';
import {isItNotMe} from './../lib/me';

const attr = {
    game: 'game',
    counter: 'counter',
    node: 'node'
};

export class DisableScreen extends BaseModel {
    constructor(data) {
        super(data);

        const model = this;

        model.createDomNode();
        model.reset();
        model.increase();

        model.startListening();

        model.onChangeCurrentUserPublicId(model.get('game').get('currentUserPublicId'));
    }

    createDomNode() {
        const model = this;
        const node = document.createElement('div');

        node.style.width = '100%';
        node.style.height = '100%';
        node.style.left = 0;
        node.style.top = 0;
        node.style.position = 'fixed';
        node.style.zIndex = 10;
        node.style.display = 'none';
        node.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        model.set(attr.node, node);
        document.querySelector('.js-app-wrapper').appendChild(node);
    }

    startListening() {
        const model = this;
        const node = model.get(attr.node);

        model.onChange(attr.counter, counter => {
            if (counter < 0) {
                /*
                when it happen when user get a turn
                but previous action still in progress
                TODO: try to fix it
                 */
                console.warn('DisableScreen counter < 0');
                model.set(attr.counter, 0);
                return;
            }

            if (counter === 0) {
                console.log('---- hide screen');
                node.style.display = 'none';
                return;
            }

            node.style.display = 'block';
            console.log('---- show screen');
        });

        model.listenTo(
            model.get(attr.game),
            'currentUserPublicId',
            model.onChangeCurrentUserPublicId,
            model
        );
    }

    onChangeCurrentUserPublicId(currentUserPublicId) {
        const model = this;

        model.reset();
        if (isItNotMe({publicId: currentUserPublicId})) {
            model.increase();
        }
    }

    increase() {
        this.changeBy(attr.counter, 1);
    }

    decrease() {
        this.changeBy(attr.counter, -1);
    }

    reset() {
        const model = this;

        model.set(attr.counter, 0);
    }

    destroy() {
        const model = this;
        const node = model.get(attr.node);

        document.querySelector('.js-app-wrapper').removeChild(node);

        super.destroy();
    }
}
