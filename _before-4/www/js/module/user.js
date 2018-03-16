// @flow
/* global localStorage, KeyValue */

type userAttr = {
    id: string
}

const userLocalStorageField = 'user-data-v.0.1';

export default class User {
    attr: userAttr;

    constructor() {
        const user = this; // eslint-disable-line consistent-this

        user.attr = {id: 'no-user-id'};

        const userId: string = User.getData().id || 'user-id-' + String(Math.random()).substr(2);

        user.setId(userId);
    }

    getId(): string {
        return this.attr.id;
    }

    setId(id: string): User {
        this.attr.id = id;
        User.saveData({id});
        return this;
    }

    static saveData(data: KeyValue): KeyValue {
        const savedData = User.getData();

        Object.assign(savedData, data);

        localStorage.setItem(userLocalStorageField, JSON.stringify(savedData));

        return data;
    }

    static getData(): Object {
        return JSON.parse(localStorage.getItem(userLocalStorageField) || '{}');
    }
}

const userModel = new User();

export {userModel as user};
