/* global describe, it, beforeEach, afterEach */
/* eslint no-invalid-this: 0 */

import {assert} from 'chai';
import BaseModel from './base-model';

describe('Base model', function baseModelTest() {
    let model = null;

    beforeEach(() => {
        model = new BaseModel();
        return model;
    });

    afterEach(() => model.destroy());


    it('constructor', () => {
        model = new BaseModel({prop: 'value'});
        assert(model.get('prop') === 'value');
    });


    it('set/get/changeBy', () => {
        model.set('key-1', 'value-1');
        assert(model.get('key-1') === 'value-1');

        model.set({'key-2': 'value-2'});
        assert(model.get('key-2') === 'value-2');

        model.set({'key-3': 1});
        model.changeBy('key-3', 2);
        assert(model.get('key-3') === 3);
    });


    it('onChange key/value, object', () => {
        const changeMyKey = {
            key: ''
        };

        // check key value change
        model.onChange('keyValueChange', function onKeyValueChange() {
            this.key = 'keyValueChange';
        }, changeMyKey);

        model.set('keyValueChange', 'newKeyValue');

        assert(changeMyKey.key === 'keyValueChange');

        // check object change
        model.onChange('objectChange', function onObjectChange() {
            this.key = 'newObjectValue';
        }, changeMyKey);

        model.set({objectChange: 'newObjectValue'});

        assert(changeMyKey.key === 'newObjectValue');
    });


    it('onChange passed params', () => {
        let paramNewValue = '', paramOldValue = '';

        model.set({checkParam: 'oldCheckParam'});

        // check passed params
        model.onChange('checkParam', (newValue, oldValue) => {
            paramNewValue = newValue;
            paramOldValue = oldValue;
        });

        model.set('checkParam', 'newCheckParam');

        assert(paramNewValue === 'newCheckParam');
        assert(paramOldValue === 'oldCheckParam');
    });

    it('onChange list on properties', () => {
        let paramNewValue = '', paramOldValue = '';

        model.set({
            prop1: 'val_1',
            prop2: 'val_2',
            prop3: 'val_3'
        });

        // check passed params
        model.onChange(['prop1', 'prop2', 'prop3'], (newValue, oldValue) => {
            paramNewValue = newValue;
            paramOldValue = oldValue;
        });

        model.set('prop2', 'new_val_2');

        assert(paramNewValue === 'new_val_2');
        assert(paramOldValue === 'val_2');
    });


    it('offChange', () => {
        let counter = 0;

        function paramOnePass() {
            counter += 1;
        }

        function paramTwoPass() {
            counter += 10;
        }

        function paramThreePass() {
            counter += 100;
        }

        model.onChange('paramOnePass', paramOnePass);
        model.offChange('paramOnePass');
        model.trigger('paramOnePass');

        model.onChange('paramTwoPass', paramTwoPass);
        model.onChange('paramTwoPass', () => paramTwoPass()); // should add 10
        model.offChange('paramTwoPass', paramTwoPass);
        model.trigger('paramTwoPass');

        model.onChange('paramThreePass', paramThreePass, this);
        model.onChange('paramThreePass', () => paramThreePass()); // should add 100
        model.onChange('paramThreePass', () => paramThreePass(), {}); // should add 100
        model.offChange('paramThreePass', paramThreePass, this);
        model.trigger('paramThreePass');

        assert(counter === 210);
    });

    it('offChange list on properties', () => {
        let paramNewValue = '', paramOldValue = '';

        model.set({
            prop1: 'val_1',
            prop2: 'val_2',
            prop3: 'val_3'
        });

        // check passed params
        model.onChange(['prop1', 'prop2', 'prop3'], (newValue, oldValue) => {
            paramNewValue = newValue;
            paramOldValue = oldValue;
        });

        // check passed params
        model.offChange(['prop2', 'prop3']);

        model.set('prop2', 'new_val_2');

        assert(paramNewValue === '');
        assert(paramOldValue === '');
    });

    it('trigger', () => {
        let paramNewValue = '', paramOldValue = '';

        model.set('triggerParam', 'triggerValue');

        model.onChange('triggerParam', (newValue, oldValue) => {
            paramNewValue = newValue;
            paramOldValue = oldValue;
        });

        model.trigger('triggerParam');

        assert(paramNewValue === 'triggerValue');
        assert(paramOldValue === 'triggerValue');
    });


    it('do not extra trigger', () => {
        let shouldBeTrue = true;

        model.set({checkParam: 'checkValue'});

        // check passed params
        model.onChange('checkParam', () => {
            shouldBeTrue = false;
        });

        model.set('checkParam', 'checkValue');

        assert(shouldBeTrue);
    });


    it('destroy', () => {
        model.set({anyParam: 'anyValue'});

        model.onChange('anyParam', () => {
        });

        model.destroy();

        assert.deepEqual(model.getAllListeners(), {});
        assert.deepEqual(model.getAllAttributes(), {});
    });
});
